import { Lightbulb, UserCircle, Eye, Shield, CircleHelp } from "lucide-react";

/**
 * Tips card component
 * Shows summarized tips with DaisyUI tooltips for more info, each with a unique icon and info mark
 */
const TipsCard = () => {
  // Each tip: { label: string, detail: string, icon: JSX }
  const tips = [
    {
      label: "Change your avatar",
      detail: "Change your avatar anytime from your profile page.",
      icon: <UserCircle className="w-4 h-4 text-primary flex-shrink-0" />,
    },
    {
      label: "Profile visibility",
      detail: "Your profile is visible to your contacts.",
      icon: <Eye className="w-4 h-4 text-accent flex-shrink-0" />,
    },
    {
      label: "Security",
      detail: "Keep your information secure.",
      icon: <Shield className="w-4 h-4 text-success flex-shrink-0" />,
    },
  ];

  return (
    <div className="bg-base-100 border border-base-200 rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg font-semibold text-base-content/80">Profile Tips</h2>
      </div>
      <ul className="flex flex-col gap-3 mt-2">
        {tips.map((tip, idx) => (
          <li key={idx} className="flex items-center gap-3 text-base-content/80 text-sm">
            <div className="tooltip tooltip-right" data-tip={tip.detail}>
              <span className="cursor-help font-medium flex items-center gap-2">
                {tip.icon}
                {tip.label}
                <CircleHelp className="w-4 h-4 text-base-content/50 ml-1 flex-shrink-0" />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TipsCard;
