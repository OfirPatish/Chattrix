import { useState } from "react";

/**
 * Custom hook for form state management
 *
 * @param {Object} initialValues Initial form values
 * @returns {Object} Form state utilities and values
 */
export const useFormState = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  /**
   * Updates a single form field
   *
   * @param {string} name Field name
   * @param {any} value Field value
   */
  const handleChange = (name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user changes the value
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Update form values from an event
   *
   * @param {Event} e Change event from input
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Handle different input types
    const fieldValue = type === "checkbox" ? checked : value;
    handleChange(name, fieldValue);
  };

  /**
   * Reset form to initial values or specified values
   *
   * @param {Object} newValues Optional new values to reset to
   */
  const resetForm = (newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
  };

  /**
   * Set form validation errors
   *
   * @param {Object} newErrors Object with field names as keys and error messages as values
   */
  const setFieldErrors = (newErrors) => {
    setErrors(newErrors);
  };

  return {
    values,
    errors,
    handleChange,
    handleInputChange,
    resetForm,
    setFieldErrors,
    setValues,
  };
};
