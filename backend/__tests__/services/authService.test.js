import { describe, it, expect, beforeEach, beforeAll, afterAll } from "@jest/globals";
import * as authService from "../../services/authService.js";
import User from "../../models/User.js";
import mongoose from "mongoose";

// Mock database connection for tests
const TEST_MONGO_URL =
  process.env.TEST_MONGO_URL || "mongodb://localhost:27017/chattrix-test";

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_MONGO_URL);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth Service", () => {

  beforeEach(async () => {
    // Clean up test users
    await User.deleteMany({ email: /^test/ });
  });

  it("should register a new user", async () => {
    const result = await authService.registerUser(
      "testuser",
      "test@example.com",
      "Test1234"
    );

    expect(result).toHaveProperty("user");
    expect(result).toHaveProperty("accessToken");
    expect(result).toHaveProperty("refreshToken");
    expect(result.user.username).toBe("testuser");
    expect(result.user.email).toBe("test@example.com");
  });

  it("should throw error when registering duplicate user", async () => {
    await authService.registerUser("testuser", "test@example.com", "Test1234");

    await expect(
      authService.registerUser("testuser", "test@example.com", "Test1234")
    ).rejects.toThrow("User with this email or username already exists");
  });

  it("should login with correct credentials", async () => {
    await authService.registerUser("testuser", "test@example.com", "Test1234");

    const result = await authService.loginUser("test@example.com", "Test1234");

    expect(result).toHaveProperty("user");
    expect(result).toHaveProperty("accessToken");
    expect(result).toHaveProperty("refreshToken");
    expect(result.user.email).toBe("test@example.com");
    expect(result.user.isOnline).toBe(true);
  });

  it("should throw error with incorrect password", async () => {
    await authService.registerUser("testuser", "test@example.com", "Test1234");

    await expect(
      authService.loginUser("test@example.com", "WrongPassword")
    ).rejects.toThrow("Invalid email or password");
  });
});

