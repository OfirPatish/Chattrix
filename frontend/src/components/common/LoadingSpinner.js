export default function LoadingSpinner({ 
  size = "md", 
  text, 
  className = "" 
}) {
  const sizeClasses = {
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className={`loading loading-spinner ${sizeClasses[size]} text-primary`}></div>
      {text && <p className="text-base-content/60">{text}</p>}
    </div>
  );
}

