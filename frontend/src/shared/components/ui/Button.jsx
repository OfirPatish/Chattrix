import React from "react";

/**
 * Reusable button component with loading state support using daisyUI
 *
 * @param {Object} props Component properties
 * @param {string} props.type Button type (button, submit, reset)
 * @param {boolean} props.primary Use primary button styling
 * @param {boolean} props.secondary Use secondary button styling
 * @param {boolean} props.accent Use accent button styling
 * @param {boolean} props.ghost Use ghost button styling
 * @param {boolean} props.link Use link button styling
 * @param {boolean} props.outline Use outline styling
 * @param {string} props.size Button size (lg, md, sm, xs)
 * @param {boolean} props.fullWidth Make button full width
 * @param {boolean} props.loading Show loading state
 * @param {boolean} props.disabled Disable the button
 * @param {string} props.loadingText Text to display during loading
 * @param {React.ReactNode} props.icon Optional icon to display
 * @param {Function} props.onClick Click handler function
 * @param {React.ReactNode} props.children Button content
 */
const Button = ({
  type = "button",
  primary = false,
  secondary = false,
  accent = false,
  ghost = false,
  link = false,
  outline = false,
  size,
  fullWidth = false,
  loading = false,
  disabled = false,
  loadingText,
  icon,
  onClick,
  children,
  className = "",
  ...rest
}) => {
  // Determine the button's class based on props
  const buttonClass = `
    btn
    ${primary ? "btn-primary" : ""}
    ${secondary ? "btn-secondary" : ""}
    ${accent ? "btn-accent" : ""}
    ${ghost ? "btn-ghost" : ""}
    ${link ? "btn-link" : ""}
    ${outline ? "btn-outline" : ""}
    ${size ? `btn-${size}` : ""}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  return (
    <button type={type} className={buttonClass} disabled={disabled || loading} onClick={onClick} {...rest}>
      {loading ? (
        <>
          <span className="loading loading-spinner loading-sm mr-2"></span>
          {loadingText || children}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
