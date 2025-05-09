import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import UserDetailsCard from "./components/UserDetailsCard";
import AccountStats from "./components/AccountStats";
import { BadgeCheck, UserCircle, Shield } from "lucide-react";

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
    <div className="min-h-screen bg-base-200 pt-24 pb-8 px-4 w-full overflow-x-hidden">
      <div className="container mx-auto max-w-4xl">
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-4 sm:p-6 md:p-8">
            {/* Profile Header - Clean and minimal */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
              <div className="relative">
                <div className="avatar">
                  <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                    <img src={authUser?.profilePic || "/avatar.png"} alt="Profile" className="mask mask-squircle" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-success text-white rounded-full p-1 shadow-md">
                  <BadgeCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold mb-2">{authUser?.username}</h1>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <div className="badge badge-primary">Active</div>
                  <div className="badge badge-outline">Member</div>
                </div>
              </div>
            </div>

            <div className="divider my-3 sm:my-5"></div>

            {/* Profile Content - Single column layout */}
            <div className="space-y-6">
              {/* Profile settings first for emphasis */}
              <div>
                <h2 className="card-title flex items-center gap-2 mb-4">
                  <UserCircle className="w-5 h-5 text-primary" />
                  <span>Profile Settings</span>
                </h2>
                <UserDetailsCard />
              </div>

              <div className="divider"></div>

              {/* Account information below */}
              <div>
                <h2 className="card-title flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Account Information</span>
                </h2>
                <AccountStats />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
