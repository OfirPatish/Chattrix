import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../setup/appSetup.js";
import { setupTestDB, teardownTestDB } from "../setup/testSetup.js";

describe("Health Check API", () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  describe("GET /api/health", () => {
    it("should return health status", async () => {
      const response = await request(app)
        .get("/api/health")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.status).toBe("OK");
      expect(response.body.database).toBe("connected");
      expect(response.body).toHaveProperty("timestamp");
    });

    it("should include socket.io status", async () => {
      const response = await request(app)
        .get("/api/health")
        .expect(200);

      expect(response.body).toHaveProperty("socketio");
      expect(response.body.socketio).toHaveProperty("status");
      expect(response.body.socketio).toHaveProperty("connections");
    });

    it("should include memory usage", async () => {
      const response = await request(app)
        .get("/api/health")
        .expect(200);

      expect(response.body).toHaveProperty("memory");
      expect(response.body.memory).toHaveProperty("used");
      expect(response.body.memory).toHaveProperty("total");
      expect(response.body.memory).toHaveProperty("unit", "MB");
    });
  });

  describe("GET /", () => {
    it("should return API info", async () => {
      const response = await request(app)
        .get("/")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("api");
      expect(response.body).toHaveProperty("health");
    });
  });
});

