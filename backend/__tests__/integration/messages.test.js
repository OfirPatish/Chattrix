import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import request from "supertest";
import app from "../setup/appSetup.js";
import { setupTestDB, teardownTestDB, clearDatabase } from "../setup/testSetup.js";
import {
  createTestUser,
  getAuthHeaders,
  createTestChat,
  createTestMessage,
} from "../helpers/testHelpers.js";

describe("Messages API", () => {
  let user1, user2, user3;
  let authToken1, authToken2;
  let chatId;

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

    const chat = await createTestChat(user1._id, user2._id);
    chatId = chat._id.toString();
  });

  describe("GET /api/messages/:chatId", () => {
    it("should get messages for a chat", async () => {
      await createTestMessage(user1._id, chatId, "Hello");
      await createTestMessage(user2._id, chatId, "Hi there");

      const response = await request(app)
        .get(`/api/messages/${chatId}`)
        .set(getAuthHeaders(authToken1))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0]).toHaveProperty("content");
      expect(response.body.data[0]).toHaveProperty("sender");
      expect(response.body).toHaveProperty("page");
      expect(response.body).toHaveProperty("pages");
      expect(response.body).toHaveProperty("total");
    });

    it("should paginate messages", async () => {
      // Create multiple messages
      for (let i = 0; i < 25; i++) {
        await createTestMessage(user1._id, chatId, `Message ${i}`);
      }

      const response = await request(app)
        .get(`/api/messages/${chatId}?page=1&limit=10`)
        .set(getAuthHeaders(authToken1))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(10);
      expect(response.body.page).toBe(1);
      expect(response.body.pages).toBeGreaterThan(1);
    });

    it("should reject access for non-participant", async () => {
      const user4 = await createTestUser({ username: "user4", email: "user4@test.com" });

      const response = await request(app)
        .get(`/api/messages/${chatId}`)
        .set(getAuthHeaders(user4.accessToken))
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it("should reject invalid chat ID", async () => {
      const response = await request(app)
        .get("/api/messages/invalid-id")
        .set(getAuthHeaders(authToken1))
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/messages", () => {
    it("should create a new message", async () => {
      const response = await request(app)
        .post("/api/messages")
        .set(getAuthHeaders(authToken1))
        .send({
          chatId,
          content: "Hello, this is a test message",
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data).toHaveProperty("content", "Hello, this is a test message");
      expect(response.body.data).toHaveProperty("sender");
      expect(response.body.data.sender._id).toBe(user1._id.toString());
    });

    it("should create message with messageType", async () => {
      const response = await request(app)
        .post("/api/messages")
        .set(getAuthHeaders(authToken1))
        .send({
          chatId,
          content: "Image message",
          messageType: "image",
          imageUrl: "https://example.com/image.jpg",
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.messageType).toBe("image");
      expect(response.body.data.imageUrl).toBe("https://example.com/image.jpg");
    });

    it("should reject message without content", async () => {
      const response = await request(app)
        .post("/api/messages")
        .set(getAuthHeaders(authToken1))
        .send({
          chatId,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject message without chatId", async () => {
      const response = await request(app)
        .post("/api/messages")
        .set(getAuthHeaders(authToken1))
        .send({
          content: "Test message",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject message with content exceeding limit", async () => {
      const longContent = "a".repeat(5001);

      const response = await request(app)
        .post("/api/messages")
        .set(getAuthHeaders(authToken1))
        .send({
          chatId,
          content: longContent,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject message for non-participant", async () => {
      const user4 = await createTestUser({ username: "user4", email: "user4@test.com" });

      const response = await request(app)
        .post("/api/messages")
        .set(getAuthHeaders(user4.accessToken))
        .send({
          chatId,
          content: "Unauthorized message",
        })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/messages/:messageId/read", () => {
    let messageId;

    beforeEach(async () => {
      const message = await createTestMessage(user1._id, chatId, "Test message");
      messageId = message._id.toString();
    });

    it("should mark message as read", async () => {
      const response = await request(app)
        .put(`/api/messages/${messageId}/read`)
        .set(getAuthHeaders(authToken2))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("marked as read");
    });

    it("should allow sender to mark their own message as read", async () => {
      const response = await request(app)
        .put(`/api/messages/${messageId}/read`)
        .set(getAuthHeaders(authToken1))
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it("should reject marking message as read for non-participant", async () => {
      const user4 = await createTestUser({ username: "user4", email: "user4@test.com" });

      const response = await request(app)
        .put(`/api/messages/${messageId}/read`)
        .set(getAuthHeaders(user4.accessToken))
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it("should reject invalid message ID", async () => {
      const response = await request(app)
        .put("/api/messages/invalid-id/read")
        .set(getAuthHeaders(authToken2))
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});

