import ProfileAvatar from "./ProfileAvatar";
import { Mail, User, Info } from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";

/**
 * User details card component
 * Contains profile avatar and user information (non-editable)
 */
const UserDetailsCard = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h2 className="card-title text-xl">User Details</h2>
          <div className="badge badge-primary p-3">Active Account</div>
        </div>

        <div className="divider my-2"></div>

        {/* Avatar section */}
        <ProfileAvatar profilePic={authUser?.profilePic} />

        {/* User info fields */}
        <div className="space-y-6">
          {/* Username Display */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2 font-medium">
                <User className="w-4 h-4" /> Username
              </span>
            </label>
            <div className="flex gap-2 items-center">
              <input type="text" className="input input-bordered flex-1" value={authUser?.username} disabled />
              <div className="tooltip tooltip-left" data-tip="Username cannot be changed">
                <Info className="w-4 h-4 text-base-content/70" />
              </div>
            </div>
          </div>

          {/* Email Display */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2 font-medium">
                <Mail className="w-4 h-4" /> Email Address
              </span>
            </label>
            <div className="flex gap-2 items-center">
              <input type="email" className="input input-bordered flex-1" value={authUser?.email} disabled />
              <div className="tooltip tooltip-left" data-tip="Email address cannot be changed">
                <Info className="w-4 h-4 text-base-content/70" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsCard;
