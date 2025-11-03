import { createAvatar } from "@dicebear/core";
import { avataaars, identicon } from "@dicebear/collection";

/**
 * Generate an avatar SVG data URL using DiceBear
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

    // Convert SVG to data URL (using URI encoding for better compatibility)
    const svg = avatar.toString();
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      svg
    )}`;

    return dataUrl;
  } catch (error) {
    console.error("Error generating avatar:", error);
    // Fallback to identicon if avataaars fails
    if (style !== "identicon") {
      return generateAvatar(seed, "identicon");
    }
    // Return empty string if everything fails
    return "";
  }
};

/**
 * Generate multiple avatar options for selection
 * @param {string} username - User's username
 * @param {number} count - Number of avatars to generate (default: 9)
 * @returns {Array<string>} - Array of avatar data URLs
 */
export const generateAvatarOptions = (username, count = 9) => {
  const avatars = [];
  for (let i = 0; i < count; i++) {
    const seed = `${username}_${i}_${Date.now()}`;
    avatars.push(generateAvatar(seed, "avataaars"));
  }
  return avatars;
};

/**
 * Get avatar URL - returns existing avatar or generates one from username
 * @param {string} avatar - Existing avatar URL/data URL
 * @param {string} username - Username to use as seed if no avatar exists
 * @returns {string} - Avatar URL
 */
export const getAvatarUrl = (avatar, username) => {
  if (avatar && avatar.trim() !== "") {
    return avatar;
  }
  // Generate avatar from username if none exists
  if (username) {
    return generateAvatar(username, "avataaars");
  }
  return "";
};
