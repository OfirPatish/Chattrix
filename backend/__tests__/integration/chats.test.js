import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import request from "supertest";
import app from "../setup/appSetup.js";
import { setupTestDB, teardownTestDB, clearDatabase } from "../setup/testSetup.js";
import { createTestUser, getAuthHeaders, createTestChat } from "../helpers/testHelpers.js";

describe("Chats API", () => {
  let user1, user2, user3;
  let authToken1, authToken2;

  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
    user1 = await createTestUser({ username: "user1", email: "user1@test.com" });
    user2 = await createTestUser({ username: "user2", email: "user2@test.com" });
    user3 = await createTestUser({ username: "user3", email: "user3@test.com" });
    authToken1 = user1.accessToken;
    authToken2 = user2.accessToken;
  });

  describe("GET /api/chats", () => {
    it("should get all chats for current user", async () => {
      await createTestChat(user1._id, user2._id);
      await createTestChat(user1._id, user3._id);

      const response = await request(app)
        .get("/api/chats")
        .set(getAuthHeaders(authToken1))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0]).toHaveProperty("participants");
      expect(response.body.data[0]).toHaveProperty("updatedAt");
    });

    it("should return empty array when user has no chats", async () => {
      const response = await request(app)
        .get("/api/chats")
        .set(getAuthHeaders(authToken1))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it("should reject request without authentication", async () => {
      const response = await request(app)
        .get("/api/chats")
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/chats", () => {
    it("should create a new chat between two users", async () => {
      const response = await request(app)
        .post("/api/chats")
        .set(getAuthHeaders(authToken1))
        .send({ userId: user2._id })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data.participants).toHaveLength(2);
      expect(
        response.body.data.participants.some((p) => p._id === user1._id.toString())
      ).toBe(true);
      expect(
        response.body.data.participants.some((p) => p._id === user2._id.toString())
      ).toBe(true);
    });

    it("should return existing chat if chat already exists", async () => {
      // Create chat first via API
      const firstResponse = await request(app)
        .post("/api/chats")
        .set(getAuthHeaders(authToken1))
        .send({ userId: user2._id })
        .expect(201);

      // Try to create again - should return existing chat
      const response = await request(app)
        .post("/api/chats")
        .set(getAuthHeaders(authToken1))
        .send({ userId: user2._id })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.participants).toHaveLength(2);
      expect(response.body.data._id).toBe(firstResponse.body.data._id);
    });

    it("should reject chat creation with invalid user ID", async () => {
      const response = await request(app)
        .post("/api/chats")
        .set(getAuthHeaders(authToken1))
        .send({ userId: "invalid-id" })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject chat creation without userId", async () => {
      const response = await request(app)
        .post("/api/chats")
        .set(getAuthHeaders(authToken1))
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject chat creation with non-existent user", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const response = await request(app)
        .post("/api/chats")
        .set(getAuthHeaders(authToken1))
        .send({ userId: fakeId })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("User not found");
    });
  });

  describe("GET /api/chats/:chatId", () => {
    let chatId;

    beforeEach(async () => {
      const chat = await createTestChat(user1._id, user2._id);
      chatId = chat._id.toString();
    });

    it("should get chat by ID", async () => {
      const response = await request(app)
        .get(`/api/chats/${chatId}`)
        .set(getAuthHeaders(authToken1))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("_id", chatId);
      expect(response.body.data.participants).toHaveLength(2);
    });

    it("should allow both participants to access chat", async () => {
      const response1 = await request(app)
        .get(`/api/chats/${chatId}`)
        .set(getAuthHeaders(authToken1))
        .expect(200);

      const response2 = await request(app)
        .get(`/api/chats/${chatId}`)
        .set(getAuthHeaders(authToken2))
        .expect(200);

      expect(response1.body.data._id).toBe(response2.body.data._id);
    });

    it("should reject access for non-participant", async () => {
      const user4 = await createTestUser({ username: "user4", email: "user4@test.com" });

      const response = await request(app)
        .get(`/api/chats/${chatId}`)
        .set(getAuthHeaders(user4.accessToken))
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it("should reject invalid chat ID", async () => {
      const response = await request(app)
        .get("/api/chats/invalid-id")
        .set(getAuthHeaders(authToken1))
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});

