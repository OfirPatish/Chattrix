import { Mail, User, Info, UserCircle } from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useState } from "react";
import { getAllAvatars } from "../../../lib/avatarUtils";
import AvatarSelector from "./AvatarSelector";

/**
 * User details card component
 * Clean, professional display of user information
 */
const UserDetailsCard = () => {
  const { authUser } = useAuthStore();
  const [showChangeAvatar, setShowChangeAvatar] = useState(false);
  const [avatars, setAvatars] = useState(getAllAvatars().slice(0, 8));

  return (
    <div className="space-y-6">
      {/* Avatar selection section */}
      <div className="bg-base-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-base">Profile Picture</h3>
          <button className="btn btn-sm btn-primary gap-2" onClick={() => setShowChangeAvatar(!showChangeAvatar)}>
            {showChangeAvatar ? "Close" : "Change"}
            <UserCircle className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-base-content/70 mb-3">Select a different avatar to represent you</p>

        {/* Avatar selector - appears when toggled */}
        {showChangeAvatar && <AvatarSelector avatars={avatars} />}
      </div>

      {/* User information */}
      <div className="grid grid-cols-1 gap-4">
        {/* Email Display */}
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" /> Email Address
            </span>
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="email"
              className="input input-bordered w-full bg-base-200/50"
              value={authUser?.email}
              disabled
            />
            <div className="tooltip tooltip-left" data-tip="Email address cannot be changed">
              <Info className="w-4 h-4 text-base-content/70" />
            </div>
          </div>
          <p className="text-xs text-base-content/60 mt-1">This is the email associated with your account</p>
        </div>

        {/* Username Display */}
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Username
            </span>
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              className="input input-bordered w-full bg-base-200/50"
              value={authUser?.username}
              disabled
            />
            <div className="tooltip tooltip-left" data-tip="Username cannot be changed">
              <Info className="w-4 h-4 text-base-content/70" />
            </div>
          </div>
          <p className="text-xs text-base-content/60 mt-1">This is how other users will see you</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsCard;
