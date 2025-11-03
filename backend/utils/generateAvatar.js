import { createAvatar } from "@dicebear/core";
import { avataaars, identicon } from "@dicebear/collection";

/**
 * Generate a random avatar SVG URL using DiceBear
 * @param {string} seed - Unique identifier (username, email, or user ID)
 * @param {string} style - Avatar style ('avataaars' or 'identicon'). Default: 'avataaars'
 * @returns {string} - SVG data URL
 */
export const generateAvatar = (seed, style = "avataaars") => {
  try {
    const avatarStyle = style === "identicon" ? identicon : avataaars;

    const avatar = createAvatar(avatarStyle, {
      seed: seed || Math.random().toString(36).substring(7),
      size: 128,
      // Add some randomness for variety
      ...(style === "avataaars" && {
        backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"],
      }),
    });

    // Convert SVG to data URL
    const svg = avatar.toString();
    const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString(
      "base64"
    )}`;

    return dataUrl;
  } catch (error) {
    console.error("Error generating avatar:", error);
    // Fallback to identicon if avataaars fails
    if (style !== "identicon") {
      return generateAvatar(seed, "identicon");
    }
    // Return a simple default if everything fails
    return "";
  }
};

/**
 * Generate a random avatar for a new user
 * Uses username + timestamp for uniqueness
 * @param {string} username - User's username
 * @returns {string} - SVG data URL
 */
export const generateRandomAvatar = (username) => {
  const seed = `${username}_${Date.now()}_${Math.random()}`;
  return generateAvatar(seed, "avataaars");
};
