# Backend Tests

Comprehensive test suite for the Chattrix backend API.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- auth.test.js

# Run tests with debug output
DEBUG=1 npm test
```

## Test Structure

```
__tests__/
├── setup/              # Test setup and configuration
│   ├── testSetup.js    # Database setup/teardown
│   ├── appSetup.js     # Express app for testing
│   └── jest.setup.js   # Jest configuration
├── helpers/            # Test helper functions
│   └── testHelpers.js  # Reusable test utilities
├── integration/        # API integration tests
│   ├── auth.test.js    # Authentication endpoints
│   ├── users.test.js   # User management endpoints
│   ├── chats.test.js   # Chat endpoints
│   └── messages.test.js # Message endpoints
├── services/           # Service layer unit tests
│   ├── authService.test.js
│   ├── userService.test.js
│   └── messageService.test.js
├── middleware/         # Middleware tests
│   └── auth.test.js    # Authentication middleware
└── utils/              # Utility function tests
    └── generateToken.test.js
```

## Test Coverage

The test suite covers:
- ✅ Authentication (register, login, refresh, logout)
- ✅ User management (search, get by ID, update profile)
- ✅ Chat operations (create, get, list)
- ✅ Message operations (create, get, mark as read)
- ✅ Middleware (authentication, validation)
- ✅ Services (business logic)
- ✅ Error handling and edge cases

## Test Environment

- Uses **MongoDB Memory Server** for isolated test database
- Tests run in `test` environment
- Each test cleans up data before running
- No external dependencies required

## Writing New Tests

### Example Integration Test

```javascript
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import request from "supertest";
import app from "../setup/appSetup.js";
import { setupTestDB, teardownTestDB, clearDatabase } from "../setup/testSetup.js";
import { createTestUser, getAuthHeaders } from "../helpers/testHelpers.js";

describe("My API", () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  it("should do something", async () => {
    const user = await createTestUser();
    const response = await request(app)
      .get("/api/endpoint")
      .set(getAuthHeaders(user.accessToken))
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
```

## Test Helpers

- `createTestUser()` - Create a test user with tokens
- `createTestUsers(count)` - Create multiple test users
- `createTestChat(user1Id, user2Id)` - Create a test chat
- `createTestMessage(senderId, chatId, content)` - Create a test message
- `getAuthHeaders(token)` - Get authorization headers for requests

## Best Practices

- ✅ Use descriptive test names
- ✅ Clean up test data in `beforeEach`
- ✅ Test both success and error cases
- ✅ Test edge cases (empty data, invalid IDs, etc.)
- ✅ Use test helpers for common operations
- ✅ Keep tests isolated and independent

