import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import { setupTestDB, teardownTestDB, clearDatabase } from "../setup/testSetup.js";
import * as userService from "../../services/userService.js";
import { createTestUser } from "../helpers/testHelpers.js";

describe("User Service", () => {
  let testUserId;

  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
    const user = await createTestUser();
    testUserId = user._id;
  });

  describe("searchUsers", () => {
    it("should search users excluding current user", async () => {
      await createTestUser({ username: "user1", email: "user1@test.com" });
      await createTestUser({ username: "user2", email: "user2@test.com" });

      const result = await userService.searchUsers(testUserId, "", 1, 10);

      expect(result.users).toBeInstanceOf(Array);
      expect(result.users.length).toBeGreaterThanOrEqual(2);
      expect(result.users.every((u) => u._id.toString() !== testUserId.toString())).toBe(true);
      expect(result.pagination).toHaveProperty("page", 1);
      expect(result.pagination).toHaveProperty("total");
    });

    it("should search users by query", async () => {
      await createTestUser({ username: "searchuser", email: "search@test.com" });
      await createTestUser({ username: "otheruser", email: "other@test.com" });

      const result = await userService.searchUsers(testUserId, "search", 1, 10);

      expect(result.users.length).toBeGreaterThan(0);
      expect(
        result.users.some((u) => u.username.toLowerCase().includes("search"))
      ).toBe(true);
    });

    it("should paginate results", async () => {
      for (let i = 0; i < 15; i++) {
        await createTestUser({
          username: `paginateuser${i}`,
          email: `paginate${i}@test.com`,
        });
      }

      const result = await userService.searchUsers(testUserId, "", 1, 10);

      expect(result.users.length).toBeLessThanOrEqual(10);
      expect(result.pagination.pages).toBeGreaterThan(1);
    });
  });

  describe("getUserById", () => {
    it("should get user by ID", async () => {
      const otherUser = await createTestUser({
        username: "targetuser",
        email: "target@test.com",
      });

      const user = await userService.getUserById(otherUser._id);

      expect(user).toHaveProperty("username", "targetuser");
      expect(user).toHaveProperty("email", "target@test.com");
      expect(user.password).toBeUndefined();
    });

    it("should throw error for non-existent user", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      await expect(userService.getUserById(fakeId)).rejects.toThrow("User not found");
    });
  });

  describe("updateUserProfile", () => {
    it("should update username", async () => {
      const updated = await userService.updateUserProfile(testUserId, {
        username: "newusername",
      });

      expect(updated.username).toBe("newusername");
    });

    it("should update avatar", async () => {
      const updated = await userService.updateUserProfile(testUserId, {
        avatar: "data:image/svg+xml;base64,test",
      });

      expect(updated.avatar).toBe("data:image/svg+xml;base64,test");
    });

    it("should update both username and avatar", async () => {
      const updated = await userService.updateUserProfile(testUserId, {
        username: "updateduser",
        avatar: "data:image/svg+xml;base64,newavatar",
      });

      expect(updated.username).toBe("updateduser");
      expect(updated.avatar).toBe("data:image/svg+xml;base64,newavatar");
    });

    it("should throw error for duplicate username", async () => {
      const otherUser = await createTestUser({
        username: "takenusername",
        email: "taken@test.com",
      });

      await expect(
        userService.updateUserProfile(testUserId, {
          username: "takenusername",
        })
      ).rejects.toThrow("Username already taken");
    });

    it("should throw error for non-existent user", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      await expect(
        userService.updateUserProfile(fakeId, { username: "test" })
      ).rejects.toThrow("User not found");
    });
  });
});

