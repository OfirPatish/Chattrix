import {
  extractErrorMessage,
  extractFieldErrors,
  getFieldError,
  formatErrorForDisplay,
  isValidationError,
  isAuthError,
  isNotFoundError,
  isConflictError,
} from "../errorUtils";

describe("errorUtils", () => {
  describe("extractErrorMessage", () => {
    it("should extract message from axios error response", () => {
      const error = {
        response: {
          data: {
            message: "Error message",
          },
        },
      };
      expect(extractErrorMessage(error)).toBe("Error message");
    });

    it("should extract message from error object", () => {
      const error = {
        message: "Error message",
      };
      expect(extractErrorMessage(error)).toBe("Error message");
    });

    it("should return default message if no message found", () => {
      const error = {};
      expect(extractErrorMessage(error, "Default error")).toBe("Default error");
    });

    it("should handle validation error array format", () => {
      const error = {
        response: {
          data: {
            errors: [
              { msg: "Error 1", param: "field1" },
              { msg: "Error 2", param: "field2" },
            ],
          },
        },
      };
      // Implementation joins all errors with ", "
      expect(extractErrorMessage(error)).toBe("Error 1, Error 2");
    });

    it("should handle string error", () => {
      // String errors don't have .message property, so default message is returned
      expect(extractErrorMessage("String error")).toBe("An error occurred");
    });
  });

  describe("extractFieldErrors", () => {
    it("should extract field errors from validation error array", () => {
      const error = {
        response: {
          data: {
            errors: [
              { msg: "Username is required", param: "username" },
              { msg: "Email is invalid", param: "email" },
            ],
          },
        },
      };
      const fieldErrors = extractFieldErrors(error);
      expect(fieldErrors.username).toBe("Username is required");
      expect(fieldErrors.email).toBe("Email is invalid");
    });

    it("should return empty object if no field errors", () => {
      const error = {
        response: {
          data: {
            message: "General error",
          },
        },
      };
      expect(extractFieldErrors(error)).toEqual({});
    });

    it("should handle non-error input", () => {
      expect(extractFieldErrors(null)).toEqual({});
      expect(extractFieldErrors({})).toEqual({});
    });
  });

  describe("getFieldError", () => {
    it("should return error for specific field", () => {
      const error = {
        response: {
          data: {
            errors: [
              { msg: "Username is required", param: "username" },
            ],
          },
        },
      };
      expect(getFieldError(error, "username")).toBe("Username is required");
    });

    it("should return null if field error not found", () => {
      const error = {
        response: {
          data: {
            errors: [
              { msg: "Email is invalid", param: "email" },
            ],
          },
        },
      };
      expect(getFieldError(error, "username")).toBeNull();
    });
  });

  describe("formatErrorForDisplay", () => {
    it("should format error with message and field errors", () => {
      const error = {
        response: {
          data: {
            message: "Validation failed",
            errors: [
              { msg: "Username is required", param: "username" },
            ],
          },
        },
      };
      const formatted = formatErrorForDisplay(error);
      // extractErrorMessage prioritizes errors array over message
      expect(formatted.message).toBe("Username is required");
      expect(formatted.fieldErrors.username).toBe("Username is required");
    });
  });

  describe("error type helpers", () => {
    it("should identify validation errors", () => {
      expect(isValidationError({ response: { status: 400 } })).toBe(true);
      expect(isValidationError({ response: { status: 422 } })).toBe(true);
      expect(isValidationError({ response: { status: 200 } })).toBe(false);
    });

    it("should identify auth errors", () => {
      expect(isAuthError({ response: { status: 401 } })).toBe(true);
      expect(isAuthError({ response: { status: 403 } })).toBe(false); // 403 is forbidden, not auth
      expect(isAuthError({ response: { status: 200 } })).toBe(false);
    });

    it("should identify not found errors", () => {
      expect(isNotFoundError({ response: { status: 404 } })).toBe(true);
      expect(isNotFoundError({ response: { status: 200 } })).toBe(false);
    });

    it("should identify conflict errors", () => {
      expect(isConflictError({ response: { status: 409 } })).toBe(true);
      expect(isConflictError({ response: { status: 200 } })).toBe(false);
    });
  });
});

