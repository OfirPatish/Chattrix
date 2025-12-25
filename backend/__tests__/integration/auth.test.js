import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import request from "supertest";
import app from "../setup/appSetup.js";
import { setupTestDB, teardownTestDB, clearDatabase } from "../setup/testSetup.js";
import User from "../../models/User.js";

describe("Auth API", () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          username: "newuser",
          email: "newuser@example.com",
          password: "Test1234",
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data).toHaveProperty("username", "newuser");
      expect(response.body.data).toHaveProperty("email", "newuser@example.com");
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");
      expect(response.body.data).not.toHaveProperty("password");
    });

    it("should reject registration with invalid email", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          username: "newuser",
          email: "invalid-email",
          password: "Test1234",
        })
        .expect(409);

      expect(response.body.success).toBe(false);
    });

    it("should reject registration with weak password", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          username: "newuser",
          email: "newuser@example.com",
          password: "weak",
        })
        .expect(409);

      expect(response.body.success).toBe(false);
    });

    it("should reject registration with duplicate email", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          username: "user1",
          email: "duplicate@example.com",
          password: "Test1234",
        })
        .expect(201);

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          username: "user2",
          email: "duplicate@example.com",
          password: "Test1234",
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("already exists");
    });

    it("should reject registration with duplicate username", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          username: "duplicate",
          email: "user1@example.com",
          password: "Test1234",
        })
        .expect(201);

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          username: "duplicate",
          email: "user2@example.com",
          password: "Test1234",
        })
        .expect(409);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          username: "loginuser",
          email: "login@example.com",
          password: "Test1234",
        });
    });

    it("should login with correct credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "login@example.com",
          password: "Test1234",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");
      expect(response.body.data).toHaveProperty("isOnline", true);
    });

    it("should reject login with incorrect password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "login@example.com",
          password: "WrongPassword",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Invalid");
    });

    it("should reject login with non-existent email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "Test1234",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/me", () => {
    let authToken;

    beforeEach(async () => {
      const registerResponse = await request(app)
        .post("/api/auth/register")
        .send({
          username: "meuser",
          email: "me@example.com",
          password: "Test1234",
        });
      authToken = registerResponse.body.data.accessToken;
    });

    it("should get current user with valid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("username", "meuser");
      expect(response.body.data).toHaveProperty("email", "me@example.com");
      expect(response.body.data).not.toHaveProperty("password");
    });

    it("should reject request without token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should reject request with invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/refresh", () => {
    let refreshToken;

    beforeEach(async () => {
      const registerResponse = await request(app)
        .post("/api/auth/register")
        .send({
          username: "refreshuser",
          email: "refresh@example.com",
          password: "Test1234",
        });
      refreshToken = registerResponse.body.data.refreshToken;
    });

    it("should refresh access token with valid refresh token", async () => {
      const response = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");
    });

    it("should reject refresh with invalid token", async () => {
      const response = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken: "invalid-token" })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/logout", () => {
    let authToken, refreshToken;

    beforeEach(async () => {
      const registerResponse = await request(app)
        .post("/api/auth/register")
        .send({
          username: "logoutuser",
          email: "logout@example.com",
          password: "Test1234",
        });
      authToken = registerResponse.body.data.accessToken;
      refreshToken = registerResponse.body.data.refreshToken;
    });

    it("should logout successfully", async () => {
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it("should reject logout without token", async () => {
      const response = await request(app)
        .post("/api/auth/logout")
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});

