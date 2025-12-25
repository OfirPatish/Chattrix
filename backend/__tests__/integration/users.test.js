import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import request from "supertest";
import app from "../setup/appSetup.js";
import { setupTestDB, teardownTestDB, clearDatabase } from "../setup/testSetup.js";
import { createTestUser, getAuthHeaders } from "../helpers/testHelpers.js";

describe("Users API", () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
    testUser = await createTestUser();
    authToken = testUser.accessToken;
  });

  describe("GET /api/users", () => {
    it("should get all users excluding current user", async () => {
      await createTestUser({ username: "user1", email: "user1@test.com" });
      await createTestUser({ username: "user2", email: "user2@test.com" });

      const response = await request(app)
        .get("/api/users")
        .set(getAuthHeaders(authToken))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      expect(response.body.data.every((u) => u._id !== testUser._id.toString())).toBe(true);
      expect(response.body).toHaveProperty("page");
      expect(response.body).toHaveProperty("pages");
      expect(response.body).toHaveProperty("total");
    });

    it("should search users by username", async () => {
      await createTestUser({ username: "searchuser", email: "search@test.com" });
      await createTestUser({ username: "otheruser", email: "other@test.com" });

      const response = await request(app)
        .get("/api/users?search=search")
        .set(getAuthHeaders(authToken))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(
        response.body.data.some((u) => u.username.toLowerCase().includes("search"))
      ).toBe(true);
    });

    it("should paginate users", async () => {
      // Create multiple users
      for (let i = 0; i < 25; i++) {
        await createTestUser({
          username: `paginateuser${i}`,
          email: `paginate${i}@test.com`,
        });
      }

      const response = await request(app)
        .get("/api/users?page=1&limit=10")
        .set(getAuthHeaders(authToken))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(10);
      expect(response.body.page).toBe(1);
      expect(response.body.pages).toBeGreaterThan(1);
    });

    it("should reject request without authentication", async () => {
      const response = await request(app)
        .get("/api/users")
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/users/:id", () => {
    it("should get user by ID", async () => {
      const otherUser = await createTestUser({
        username: "targetuser",
        email: "target@test.com",
      });

      const response = await request(app)
        .get(`/api/users/${otherUser._id}`)
        .set(getAuthHeaders(authToken))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("username", "targetuser");
      expect(response.body.data).toHaveProperty("email", "target@test.com");
      expect(response.body.data).not.toHaveProperty("password");
    });

    it("should reject invalid user ID", async () => {
      const response = await request(app)
        .get("/api/users/invalid-id")
        .set(getAuthHeaders(authToken))
        .expect(409);

      expect(response.body.success).toBe(false);
    });

    it("should return 404 for non-existent user", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const response = await request(app)
        .get(`/api/users/${fakeId}`)
        .set(getAuthHeaders(authToken))
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/users/profile", () => {
    it("should update user profile", async () => {
      const response = await request(app)
        .put("/api/users/profile")
        .set(getAuthHeaders(authToken))
        .send({
          username: "updateduser",
          avatar: "data:image/svg+xml;base64,test",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("username", "updateduser");
      expect(response.body.data).toHaveProperty("avatar");
    });

    it("should update only username", async () => {
      const response = await request(app)
        .put("/api/users/profile")
        .set(getAuthHeaders(authToken))
        .send({
          username: "newusername",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe("newusername");
    });

    it("should update only avatar", async () => {
      const response = await request(app)
        .put("/api/users/profile")
        .set(getAuthHeaders(authToken))
        .send({
          avatar: "data:image/svg+xml;base64,newavatar",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.avatar).toBe("data:image/svg+xml;base64,newavatar");
    });

    it("should reject duplicate username", async () => {
      const otherUser = await createTestUser({
        username: "takenusername",
        email: "taken@test.com",
      });

      const response = await request(app)
        .put("/api/users/profile")
        .set(getAuthHeaders(authToken))
        .send({
          username: "takenusername",
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("already taken");
    });

    it("should reject invalid username length", async () => {
      const response = await request(app)
        .put("/api/users/profile")
        .set(getAuthHeaders(authToken))
        .send({
          username: "ab",
        })
        .expect(409);

      expect(response.body.success).toBe(false);
    });
  });
});

