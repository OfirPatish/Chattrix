import {
  getChatName,
  getLastMessage,
  formatTime,
  shouldShowAvatar,
  shouldGroupWithPrevious,
  formatMessageDate,
} from "../chatHelpers";

describe("chatHelpers", () => {
  const mockUser = { _id: "user1", username: "CurrentUser" };
  const mockOtherUser = { _id: "user2", username: "OtherUser" };

  describe("getChatName", () => {
    it("should return other user username in chat", () => {
      const chat = {
        participants: [mockUser, mockOtherUser],
      };
      expect(getChatName(chat, "user1")).toBe("OtherUser");
    });

    it("should return Unknown User if other user not found", () => {
      const chat = {
        participants: [mockUser],
      };
      expect(getChatName(chat, "user1")).toBe("Unknown User");
    });

    it("should handle empty participants", () => {
      const chat = {
        participants: [],
      };
      expect(getChatName(chat, "user1")).toBe("Unknown User");
    });
  });

  describe("getLastMessage", () => {
    it("should return last message content", () => {
      const chat = {
        lastMessage: {
          content: "Hello world",
        },
      };
      expect(getLastMessage(chat)).toBe("Hello world");
    });

    it("should return default message if no last message", () => {
      const chat = {};
      expect(getLastMessage(chat)).toBe("No messages yet");
    });

    it("should handle null last message", () => {
      const chat = {
        lastMessage: null,
      };
      expect(getLastMessage(chat)).toBe("No messages yet");
    });
  });

  describe("formatTime", () => {
    it("should format date to time format for today", () => {
      // Use a date from today to ensure it's within 24 hours
      const date = new Date();
      date.setHours(date.getHours() - 1); // 1 hour ago
      const formatted = formatTime(date);
      // formatTime uses toLocaleTimeString which may include AM/PM, so just check it's a string with time format
      expect(formatted).toMatch(/\d{1,2}:\d{2}/);
    });

    it("should format date to weekday for this week", () => {
      // Use a date from this week (but not today)
      const date = new Date();
      date.setDate(date.getDate() - 2); // 2 days ago
      const formatted = formatTime(date);
      expect(typeof formatted).toBe("string");
      expect(formatted.length).toBeGreaterThan(0);
    });
  });

  describe("shouldShowAvatar", () => {
    it("should show avatar for first message from user", () => {
      const message = {
        sender: { _id: "user2" },
        createdAt: new Date(),
      };
      const prevMessage = null;
      expect(shouldShowAvatar(message, prevMessage, "user1")).toBe(true);
    });

    it("should not show avatar if previous message is from same user", () => {
      const message = {
        sender: { _id: "user2" },
        createdAt: new Date(),
      };
      const prevMessage = {
        sender: { _id: "user2" },
        createdAt: new Date(Date.now() - 60000),
      };
      expect(shouldShowAvatar(message, prevMessage, "user1")).toBe(false);
    });

    it("should show avatar if previous message is from different user", () => {
      const message = {
        sender: { _id: "user2" },
        createdAt: new Date(),
      };
      const prevMessage = {
        sender: { _id: "user1" },
        createdAt: new Date(Date.now() - 60000),
      };
      expect(shouldShowAvatar(message, prevMessage, "user1")).toBe(true);
    });
  });

  describe("shouldGroupWithPrevious", () => {
    it("should group messages from same user within 2 minutes", () => {
      const now = Date.now();
      const message = {
        sender: { _id: "user2" },
        createdAt: new Date(now),
      };
      const prevMessage = {
        sender: { _id: "user2" },
        createdAt: new Date(now - 119000), // Just under 2 minutes ago (< 120000ms)
      };
      expect(shouldGroupWithPrevious(message, prevMessage, "user1")).toBe(true);
    });

    it("should not group messages from different users", () => {
      const message = {
        sender: { _id: "user2" },
        createdAt: new Date(),
      };
      const prevMessage = {
        sender: { _id: "user1" },
        createdAt: new Date(Date.now() - 120000),
      };
      expect(shouldGroupWithPrevious(message, prevMessage, "user1")).toBe(false);
    });

    it("should not group if more than 2 minutes apart", () => {
      const message = {
        sender: { _id: "user2" },
        createdAt: new Date(),
      };
      const prevMessage = {
        sender: { _id: "user2" },
        createdAt: new Date(Date.now() - 180000), // 3 minutes ago (more than 2 minutes)
      };
      expect(shouldGroupWithPrevious(message, prevMessage, "user1")).toBe(false);
    });
  });

  describe("formatMessageDate", () => {
    it("should format today as Today", () => {
      const date = new Date();
      const formatted = formatMessageDate(date.toISOString());
      expect(formatted).toBe("Today");
    });

    it("should format yesterday as Yesterday", () => {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      const formatted = formatMessageDate(date.toISOString());
      expect(formatted).toBe("Yesterday");
    });

    it("should format older dates", () => {
      const date = new Date("2024-01-01");
      const formatted = formatMessageDate(date.toISOString());
      expect(formatted).toMatch(/\w+,\s+\w+\s+\d+/); // Format: "Monday, January 1"
    });
  });
});

