"use client";

import { useState, useEffect, useMemo } from "react";
import { generateAvatarOptions } from "@/utils/avatarUtils";
import Image from "next/image";
import { RefreshCw, AlertCircle } from "lucide-react";

export default function AvatarSelector({ username, selectedAvatar, onSelect }) {
  const [avatarOptions, setAvatarOptions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Generate stable keys for avatars using URL hash
  const avatarKeys = useMemo(() => {
    return avatarOptions.map((url, index) => {
      // Create a stable key from URL or use index as fallback
      try {
        return url ? `avatar-${url.slice(0, 50)}-${index}` : `avatar-${index}`;
      } catch {
        return `avatar-${index}`;
      }
    });
  }, [avatarOptions]);

  useEffect(() => {
    if (username) {
      try {
        setError(null);
        const options = generateAvatarOptions(username, 9);
        if (Array.isArray(options) && options.length > 0) {
          setAvatarOptions(options);
        } else {
          setError("Failed to generate avatar options");
        }
      } catch (err) {
        console.error("Error generating avatars:", err);
        setError("Failed to generate avatar options");
        setAvatarOptions([]);
      }
    } else {
      setAvatarOptions([]);
    }
  }, [username]);

  const handleGenerateNew = () => {
    if (!username || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const newOptions = generateAvatarOptions(username, 9);
      if (Array.isArray(newOptions) && newOptions.length > 0) {
        setAvatarOptions(newOptions);
      } else {
        setError("Failed to generate new avatar options");
      }
    } catch (err) {
      console.error("Error generating new avatars:", err);
      setError("Failed to generate new avatar options");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!username) {
    return null;
  }

  return (
    <div className="pt-4 border-t border-base-300 mt-4">
      <h3 className="text-sm font-semibold text-base-content mb-3">
        Choose Avatar
      </h3>

      {error && (
        <div className="alert alert-error mb-3 py-2">
          <AlertCircle className="h-4 w-4" />
          <span className="text-xs">{error}</span>
        </div>
      )}

      {avatarOptions.length === 0 && !error && (
        <div className="flex items-center justify-center py-8">
          <div className="loading loading-spinner loading-md text-primary"></div>
        </div>
      )}

      {avatarOptions.length > 0 && (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {avatarOptions.map((avatarUrl, index) => {
              if (!avatarUrl) return null;

              return (
                <button
                  key={avatarKeys[index] || `avatar-${index}`}
                  onClick={() => onSelect(avatarUrl)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedAvatar === avatarUrl
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-base-300 hover:border-primary/50"
                  }`}
                  disabled={isGenerating}
                >
                  <Image
                    src={avatarUrl}
                    alt={`Avatar option ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized
                    onError={(e) => {
                      console.error("Failed to load avatar image:", avatarUrl);
                      e.target.style.display = "none";
                    }}
                  />
                </button>
              );
            })}
          </div>
          <button
            onClick={handleGenerateNew}
            disabled={isGenerating || !username}
            className="btn btn-ghost btn-sm mt-3 w-full"
          >
            {isGenerating ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate New Options
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}
