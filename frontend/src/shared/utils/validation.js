import toast from "react-hot-toast";

/**
 * Validates email format using regex
 *
 * @param {string} email Email to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

/**
 * Validates login form data
 *
 * @param {Object} data Form data with email and password
 * @returns {boolean} True if valid, false otherwise
 */
export const validateLoginForm = (data) => {
  if (!data.email.trim()) {
    toast.error("Email is required");
    return false;
  }

  if (!isValidEmail(data.email)) {
    toast.error("Invalid email format");
    return false;
  }

  if (!data.password) {
    toast.error("Password is required");
    return false;
  }

  return true;
};

/**
 * Validates registration form data
 *
 * @param {Object} data Form data with username, email and password
 * @returns {boolean} True if valid, false otherwise
 */
export const validateRegisterForm = (data) => {
  if (!data.username?.trim()) {
    toast.error("Username is required");
    return false;
  }

  if (!validateLoginForm(data)) {
    return false;
  }

  if (data.password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }

  return true;
};
