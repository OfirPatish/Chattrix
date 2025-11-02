import { Loader2 } from "lucide-react";

export default function LoadingIndicator({ 
  text = "Loading...", 
  size = "md",
  className = "" 
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-12 w-12",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} text-primary animate-spin`} />
      {text && <span className="text-base-content/60">{text}</span>}
    </div>
  );
}

