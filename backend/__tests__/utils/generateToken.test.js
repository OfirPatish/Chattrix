import { describe, it, expect, beforeAll } from "@jest/globals";
import {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
} from "../../utils/generateToken.js";
import jwt from "jsonwebtoken";

describe("Token Generation", () => {
  const testUserId = "507f1f77bcf86cd799439011";
  const originalSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    // Set test JWT secret if not set
    if (!process.env.JWT_SECRET) {
      process.env.JWT_SECRET = "test-secret-key";
    }
  });

  it("should generate an access token", () => {
    const token = generateAccessToken(testUserId);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe(testUserId);
    expect(decoded.exp).toBeDefined();
  });

  it("should generate a refresh token", () => {
    const token = generateRefreshToken(testUserId);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );
    expect(decoded.id).toBe(testUserId);
  });

  it("should generate both tokens", () => {
    const tokens = generateTokens(testUserId);
    expect(tokens).toHaveProperty("accessToken");
    expect(tokens).toHaveProperty("refreshToken");
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
  });

  it("should generate tokens with different expiration times", () => {
    const tokens = generateTokens(testUserId);
    const accessDecoded = jwt.decode(tokens.accessToken);
    const refreshDecoded = jwt.decode(tokens.refreshToken);

    // Refresh token should expire later than access token
    expect(refreshDecoded.exp).toBeGreaterThan(accessDecoded.exp);
  });
});

