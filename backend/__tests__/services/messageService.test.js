import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import { setupTestDB, teardownTestDB, clearDatabase } from "../setup/testSetup.js";
import * as messageService from "../../services/messageService.js";
import { createTestUser, createTestChat, createTestMessage } from "../helpers/testHelpers.js";

describe("Message Service", () => {
  let user1, user2, user3;
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

    const chat = await createTestChat(user1._id, user2._id);
    chatId = chat._id.toString();
  });

  describe("getChatMessages", () => {
    it("should get messages for a chat", async () => {
      await createTestMessage(user1._id, chatId, "Message 1");
      await createTestMessage(user2._id, chatId, "Message 2");

      const result = await messageService.getChatMessages(chatId, 1, 50);

      expect(result.messages).toBeInstanceOf(Array);
      expect(result.messages.length).toBe(2);
      expect(result.messages[0]).toHaveProperty("content");
      expect(result.messages[0]).toHaveProperty("sender");
      expect(result.pagination).toHaveProperty("page", 1);
    });

    it("should paginate messages", async () => {
      for (let i = 0; i < 15; i++) {
        await createTestMessage(user1._id, chatId, `Message ${i}`);
      }

      const result = await messageService.getChatMessages(chatId, 1, 10);

      expect(result.messages.length).toBeLessThanOrEqual(10);
      expect(result.pagination.pages).toBeGreaterThan(1);
    });
  });

  describe("createMessage", () => {
    it("should create a message", async () => {
      const message = await messageService.createMessage(
        user1._id,
        chatId,
        "Test message",
        "text",
        ""
      );

      expect(message).toHaveProperty("_id");
      expect(message).toHaveProperty("content", "Test message");
      expect(message).toHaveProperty("sender");
      expect(message.sender._id.toString()).toBe(user1._id.toString());
    });

    it("should throw error for non-participant", async () => {
      await expect(
        messageService.createMessage(user3._id, chatId, "Unauthorized", "text", "")
      ).rejects.toThrow("Chat not found or access denied");
    });

    it("should throw error for content exceeding limit", async () => {
      const longContent = "a".repeat(5001);
      await expect(
        messageService.createMessage(user1._id, chatId, longContent, "text", "")
      ).rejects.toThrow("cannot exceed 5000 characters");
    });

    it("should throw error for empty content", async () => {
      await expect(
        messageService.createMessage(user1._id, chatId, "   ", "text", "")
      ).rejects.toThrow("cannot be empty");
    });
  });

  describe("markMessageAsRead", () => {
    let messageId;

    beforeEach(async () => {
      const message = await createTestMessage(user1._id, chatId, "Test message");
      messageId = message._id.toString();
    });

    it("should mark message as read", async () => {
      const message = await messageService.markMessageAsRead(messageId, user2._id);

      expect(message.readBy).toBeInstanceOf(Array);
      expect(message.readBy.length).toBeGreaterThan(0);
      expect(
        message.readBy.some((read) => read.user.toString() === user2._id.toString())
      ).toBe(true);
    });

    it("should throw error for non-participant", async () => {
      await expect(
        messageService.markMessageAsRead(messageId, user3._id)
      ).rejects.toThrow("Access denied");
    });

    it("should throw error for non-existent message", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      await expect(
        messageService.markMessageAsRead(fakeId, user2._id)
      ).rejects.toThrow("Message not found");
    });
  });
});

