import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import UserDetailsCard from "./components/UserDetailsCard";
import AccountStats from "./components/AccountStats";
import TipsCard from "./components/TipsCard";

/**
 * Profile page component
 * Uses modular components to display and manage user profile
 */
const Profile = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, [authUser, navigate]);

  // If no auth user, show loading or redirect
  if (!authUser) {
    return null; // Return null while the redirect happens
  }

  return (
    <div className="min-h-screen bg-base-200 pt-24 pb-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Side - User Details Card */}
          <div className="md:col-span-2">
            <UserDetailsCard />
          </div>

          {/* Right Side - Stats & Account Info */}
          <div className="md:col-span-1">
            <AccountStats />
            <TipsCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
