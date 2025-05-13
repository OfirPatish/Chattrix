import { createAvatar } from "@dicebear/core";
import { botttsNeutral } from "@dicebear/collection";

// Predefined background colors
const BACKGROUND_COLORS = [
  "b6e3f4", // light blue
  "c0aede", // lavender
  "d1d4f9", // periwinkle
  "ffd5dc", // light pink
  "ffdfbf", // peach
  "d1f7c4", // light green
  "ffffbf", // light yellow
  "ffdfd3", // salmon
  "b5e2fa", // sky blue
  "d0f0c0", // tea green
  "f0e68c", // khaki
  "f08080", // light coral
];

// Curated set of avatar options with guaranteed visual features
const AVATAR_OPTIONS = [
  { face: ["square"], eyes: ["bulging"], mouth: ["smile01"], top: ["antenna01"] },
  { face: ["round"], eyes: ["round"], mouth: ["smile02"], side: ["square01"] },
  { face: ["square"], eyes: ["robocop"], mouth: ["square01"], texture: ["camo01"] },
  { face: ["round"], eyes: ["eva"], mouth: ["square02"], side: ["round01"] },
  { face: ["square"], eyes: ["giggle"], mouth: ["bite"], top: ["horns"] },
  { face: ["round"], eyes: ["glow"], mouth: ["diagram"], top: ["antenna02"] },
  { face: ["square"], eyes: ["happy"], mouth: ["grill01"], side: ["square02"] },
  { face: ["round"], eyes: ["hearts"], mouth: ["grill02"], texture: ["camo02"] },
  { face: ["square"], eyes: ["illuminati"], mouth: ["grill03"], side: ["round02"] },
  { face: ["round"], eyes: ["shader"], mouth: ["smile03"], top: ["bolt"] },
  { face: ["square"], eyes: ["slice"], mouth: ["texture"], texture: ["circuits"] },
  { face: ["round"], eyes: ["streamline"], mouth: ["wide01"], side: ["square03"] },
];

/**
 * Get a random background color
 * @returns {string} Random color hex code
 */
export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * BACKGROUND_COLORS.length);
  return BACKGROUND_COLORS[randomIndex];
};

/**
 * Get a random avatar option from the predefined set, including color
 * @returns {Object} Random avatar options
 */
export const getRandomAvatarOptions = () => {
  const randomIndex = Math.floor(Math.random() * AVATAR_OPTIONS.length);
  const randomColor = getRandomColor();

  return {
    ...AVATAR_OPTIONS[randomIndex],
    backgroundColor: [randomColor],
  };
};

/**
 * Generate an avatar SVG string using DiceBear
 * @param {Object} options - Avatar options (eyes, mouth, etc.)
 * @returns {string} SVG string
 */
export const generateAvatar = (options = {}) => {
  // Ensure we always have required elements to prevent blank avatars
  const defaultOptions = {
    face: ["square"],
    eyes: ["bulging"],
    mouth: ["smile01"],
    top: ["antenna01"],
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    size: 128, // Smaller size for optimization
  };

  const avatar = createAvatar(botttsNeutral, mergedOptions);

  return avatar.toDataUri();
};

/**
 * Get all predefined avatar options
 * @returns {Array} Array of avatar option objects with colors
 */
export const getAllAvatarOptions = () => {
  // Use a fixed index for color to ensure consistency across rerenders
  return AVATAR_OPTIONS.map((option, index) => ({
    ...option,
    backgroundColor: [BACKGROUND_COLORS[index % BACKGROUND_COLORS.length]],
  }));
};

/**
 * Generate all predefined avatars with consistent colors
 * @returns {Array} Array of avatar data URI strings
 */
export const getAllAvatars = () => {
  // Generate options with colors first to ensure consistency
  const optionsWithColors = getAllAvatarOptions();

  // Create optimized avatars with smaller size
  const avatars = optionsWithColors.map((options) => {
    // Always force certain properties to ensure visible features
    const avatar = createAvatar(botttsNeutral, {
      ...options,
      size: 128, // Set a smaller size for compatibility
      // Force these options to guarantee visible features
      face: options.face || ["square"],
      eyes: options.eyes || ["bulging"],
      mouth: options.mouth || ["smile01"],
    });

    return avatar.toDataUri();
  });

  return avatars;
};
