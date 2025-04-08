import { Clock, Shield } from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";

/**
 * Account stats component
 * Displays user account statistics and information
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

  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h2 className="card-title text-xl">Account Stats</h2>
        <div className="stats stats-vertical shadow w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Clock className="w-8 h-8" />
            </div>
            <div className="stat-title">Member Since</div>
            <div className="stat-value text-lg">{formatMemberDate(authUser?.createdAt)}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-success">
              <Shield className="w-8 h-8" />
            </div>
            <div className="stat-title">Account Status</div>
            <div className="stat-value text-success text-lg">Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountStats;
