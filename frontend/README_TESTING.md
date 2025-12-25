# Testing Guide

This document provides information about the test setup and how to run tests for the Chattrix frontend.

## Test Setup

The project uses:
- **Jest** - Test runner
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation

## Installation

To install testing dependencies, add them to your `package.json`:

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@babel/preset-env": "^7.23.0",
    "@babel/preset-react": "^7.23.0",
    "babel-jest": "^29.7.0"
  },
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

Tests are organized to mirror the source structure:

```
src/
├── components/
│   ├── auth/
│   │   └── __tests__/
│   │       ├── FormInput.test.js
│   │       └── PasswordInput.test.js
│   ├── chat/
│   │   └── __tests__/
│   │       ├── ChatList.test.js
│   │       └── MessageBubble.test.js
│   └── common/
│       └── __tests__/
│           └── Navbar.test.js
├── hooks/
│   └── __tests__/
│       ├── useAuth.test.js
│       └── useChats.test.js
├── store/
│   └── __tests__/
│       ├── authStore.test.js
│       └── chatStore.test.js
└── utils/
    └── __tests__/
        ├── errorUtils.test.js
        ├── avatarUtils.test.js
        └── chatHelpers.test.js
```

## Test Coverage

The test suite covers:

### Utilities
- ✅ Error handling utilities
- ✅ Avatar utilities
- ✅ Chat helper functions

### API Client
- ✅ Authentication endpoints
- ✅ User endpoints
- ✅ Chat endpoints
- ✅ Message endpoints

### Stores
- ✅ Auth store (login, register, logout, token management)
- ✅ Chat store (chats, messages, state management)

### Hooks
- ✅ Authentication hooks
- ✅ Chat hooks
- ✅ Message hooks
- ✅ User search hooks
- ✅ Settings hooks

### Components
- ✅ Auth components (FormInput, PasswordInput)
- ✅ Chat components (MessageBubble, ChatList, EmptyState)
- ✅ Common components (Navbar)
- ✅ Settings components (ProfileSection)

## Writing Tests

### Component Test Example

```javascript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MyComponent from "../MyComponent";

describe("MyComponent", () => {
  it("should render correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("should handle user interaction", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(<MyComponent onClick={handleClick} />);
    
    const button = screen.getByRole("button");
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Hook Test Example

```javascript
import { renderHook, act } from "@testing-library/react";
import { useMyHook } from "../useMyHook";

describe("useMyHook", () => {
  it("should return initial state", () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe(0);
  });

  it("should update state", () => {
    const { result } = renderHook(() => useMyHook());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.value).toBe(1);
  });
});
```

## Mocking

### Mocking Next.js

Next.js router and Image components are automatically mocked in `jest.setup.js`.

### Mocking API Calls

```javascript
jest.mock("@/lib/api", () => ({
  authAPI: {
    login: jest.fn(),
  },
}));
```

### Mocking Stores

```javascript
jest.mock("@/store/authStore", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    user: { _id: "123" },
    isAuthenticated: true,
  })),
}));
```

## Best Practices

1. **Test user behavior, not implementation details**
2. **Use `screen` queries from React Testing Library**
3. **Use `userEvent` for user interactions**
4. **Mock external dependencies**
5. **Keep tests focused and independent**
6. **Use descriptive test names**
7. **Test error cases and edge cases**

## Notes

- Tests are created but not run yet (as requested)
- Some tests may need adjustments based on actual component implementations
- Mock implementations may need refinement based on actual API responses
- Socket.io tests are not included but can be added if needed

