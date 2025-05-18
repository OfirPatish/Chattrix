import { Clock, Shield, MessageSquare } from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";

/**
 * Account stats component
 * Clean, professional stat display with icons
 */
const AccountStats = () => {
  const { authUser } = useAuthStore();

  // Format date to be more readable
  const formatMemberDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Stats data array
  const stats = [
    {
      label: "Member Since",
      value: formatMemberDate(authUser?.createdAt),
      icon: <Clock className="w-5 h-5 text-primary" />,
      iconBg: "bg-primary/10",
    },
    {
      label: "Account Status",
      value: "Active",
      badge: { text: "Verified", color: "primary" },
      icon: <Shield className="w-5 h-5 text-success" />,
      iconBg: "bg-success/10",
    },
  ];

  return (
    <div className="bg-base-100 rounded-lg">
      <div className="grid gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 rounded-lg bg-base-200/30 hover:bg-base-200/50 transition-colors"
          >
            <div className={`${stat.iconBg} p-2.5 rounded-full`}>{stat.icon}</div>
            <div>
              <div className="text-xs font-medium text-base-content/70">{stat.label}</div>
              <div className="font-medium text-base-content flex items-center gap-2">
                {stat.value}
                {stat.badge && <span className={`badge badge-${stat.badge.color} badge-sm`}>{stat.badge.text}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountStats;
