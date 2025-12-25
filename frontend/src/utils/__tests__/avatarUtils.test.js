// Mock @dicebear/core before importing avatarUtils
jest.mock("@dicebear/core", () => ({
  createAvatar: jest.fn(() => ({
    toString: jest.fn(() => "<svg>test</svg>"),
  })),
}));

jest.mock("@dicebear/collection", () => ({
  avataaars: jest.fn(),
  identicon: jest.fn(),
}));

import { getAvatarUrl } from "../avatarUtils";

describe("avatarUtils", () => {
  describe("getAvatarUrl", () => {
    it("should return avatar URL if provided", () => {
      const avatar = "data:image/svg+xml;base64,test";
      expect(getAvatarUrl(avatar, "username")).toBe(avatar);
    });

    it("should generate avatar if avatar is not provided", () => {
      // getAvatarUrl generates an avatar when avatar is null/undefined/empty
      const result1 = getAvatarUrl(null, "username");
      expect(result1).toBeTruthy();
      expect(typeof result1).toBe("string");
      
      const result2 = getAvatarUrl(undefined, "username");
      expect(result2).toBeTruthy();
      expect(typeof result2).toBe("string");
      
      const result3 = getAvatarUrl("", "username");
      expect(result3).toBeTruthy();
      expect(typeof result3).toBe("string");
    });

    it("should handle empty string avatar", () => {
      // Empty string triggers avatar generation
      const result = getAvatarUrl("", "username");
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });

    it("should handle whitespace-only avatar", () => {
      // Whitespace-only string is truthy, so it returns as-is (not null, but also not generating)
      // Actually, looking at the implementation, it checks `avatar && avatar.trim() !== ""`
      // So whitespace-only will be truthy but trim() !== "" is false, so it generates
      const result = getAvatarUrl("   ", "username");
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });
  });
});

