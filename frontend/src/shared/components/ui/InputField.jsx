import React from "react";

/**
 * Reusable input field component with icon support using daisyUI
 *
 * @param {Object} props Component properties
 * @param {string} props.type Input type (text, email, password, etc.)
 * @param {string} props.label Label text
 * @param {string} props.placeholder Placeholder text
 * @param {string} props.value Current input value
 * @param {Function} props.onChange Change handler function
 * @param {string} props.name Input field name
 * @param {React.ReactNode} props.icon Icon component to display
 * @param {React.ReactNode} props.rightIcon Optional right-aligned icon (e.g., for password visibility)
 * @param {Function} props.onRightIconClick Handler for right icon click
 * @param {boolean} props.error Whether the input has an error
 * @param {string} props.errorText Error message to display
 * @param {string} props.size Input size (lg, md, sm, xs)
 * @param {string} props.bordered Add border to input
 * @param {string} props.ghost Remove background from input
 */
const InputField = ({
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  name,
  icon,
  rightIcon,
  onRightIconClick,
  error = false,
  errorText,
  size,
  bordered = true,
  ghost = false,
  className = "",
}) => {
  const inputClasses = `
    input
    ${bordered ? "input-bordered" : ""}
    ${error ? "input-error" : ""}
    ${ghost ? "input-ghost" : ""}
    ${size ? `input-${size}` : ""}
    w-full
    ${icon ? "pl-10" : ""}
    placeholder:text-base-content/40
    focus:placeholder:text-base-content/30
    ${className}
  `;

  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text font-medium">{label}</span>
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            {React.cloneElement(icon, { className: "size-5 text-primary" })}
          </div>
        )}
        <input
          type={type}
          name={name}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {rightIcon && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center z-10 text-primary hover:text-primary-focus"
            onClick={onRightIconClick}
          >
            {React.cloneElement(rightIcon, { className: "size-5" })}
          </button>
        )}
      </div>
      {error && errorText && (
        <label className="label">
          <span className="label-text-alt text-error">{errorText}</span>
        </label>
      )}
    </div>
  );
};

export default InputField;
