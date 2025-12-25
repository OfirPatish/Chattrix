import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import request from "supertest";
import app from "../setup/appSetup.js";
import { setupTestDB, teardownTestDB, clearDatabase } from "../setup/testSetup.js";
import { createTestUser, getAuthHeaders } from "../helpers/testHelpers.js";
import TokenBlacklist from "../../models/TokenBlacklist.js";
import jwt from "jsonwebtoken";

describe("Auth Middleware", () => {
  let testUser;
  let authToken;

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

  it("should allow access with valid token", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set(getAuthHeaders(authToken))
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  it("should reject access without token", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("no token");
  });

  it("should reject access with invalid token format", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "InvalidFormat token")
      .expect(401);

    expect(response.body.success).toBe(false);
  });

  it("should reject access with expired token", async () => {
    // Create an expired token
    const expiredToken = jwt.sign(
      { id: testUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "-1h" }
    );

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${expiredToken}`)
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("expired");
  });

  it("should reject access with blacklisted token", async () => {
    // Blacklist the token
    const decoded = jwt.decode(authToken);
    await TokenBlacklist.create({
      token: authToken,
      expiresAt: new Date(decoded.exp * 1000),
    });

    const response = await request(app)
      .get("/api/auth/me")
      .set(getAuthHeaders(authToken))
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("revoked");
  });
});

