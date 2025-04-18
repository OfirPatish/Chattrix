import { Clock, Shield, MessageSquare } from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";

/**
 * Account stats component
 * Modern, minimal horizontal card layout
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

  const totalMessages = authUser?.totalMessages || 1234;

  return (
    <div className="bg-base-100 border border-base-200 rounded-xl shadow-sm mb-6 p-6 flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-base-content/80 mb-2">Account Stats</h2>
      <div className="flex flex-col gap-3">
        {/* Member Since */}
        <div className="flex items-center gap-4 p-3 rounded-lg">
          <span className="bg-primary/10 p-2 rounded-full">
            <Clock className="w-6 h-6 text-primary" />
          </span>
          <div>
            <div className="text-xs text-base-content/60">Member Since</div>
            <div className="font-medium text-base-content">{formatMemberDate(authUser?.createdAt)}</div>
          </div>
        </div>
        {/* Account Status */}
        <div className="flex items-center gap-4 p-3 rounded-lg">
          <span className="bg-success/10 p-2 rounded-full">
            <Shield className="w-6 h-6 text-success" />
          </span>
          <div>
            <div className="text-xs text-base-content/60">Account Status</div>
            <div className="font-medium text-success flex items-center gap-2">
              Active <span className="badge badge-success badge-outline text-xs">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountStats;
