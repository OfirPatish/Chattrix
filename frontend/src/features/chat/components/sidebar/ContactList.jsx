import { useChatStore } from "../../../../store/useChatStore";
import { useAuthStore } from "../../../../store/useAuthStore";

/**
 * Contact list component that displays filtered users
 */
const ContactList = ({ filteredUsers, searchQuery }) => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="overflow-y-auto w-full py-1 sm:py-2">
      {filteredUsers.map((user) => {
        const isOnline = onlineUsers?.includes(user._id);
        return (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-2 sm:p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative">
              <div className="avatar">
                <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={user.profilePic || "/avatar.png"} alt={user.username} />
                </div>
                {/* Status indicator */}
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-100 ${
                    isOnline ? "bg-success" : "bg-error"
                  }`}
                />
              </div>
            </div>

            {/* User info - Always visible */}
            <div className="text-left min-w-0 flex-1">
              <div
                className="font-medium truncate text-xs lg:text-sm max-w-[80px] sm:max-w-[120px] lg:max-w-full tooltip tooltip-right"
                data-tip={user.username}
              >
                {user.username}
              </div>
            </div>
          </button>
        );
      })}

      {filteredUsers.length === 0 && (
        <div className="flex items-center justify-center mt-4 mx-2 p-2 bg-base-200 rounded-lg">
          <span className="text-center w-full text-xs sm:text-sm font-medium text-base-content/60">
            {searchQuery ? "No users found matching your search." : "No users found. Check back later!"}
          </span>
        </div>
      )}
    </div>
  );
};

export default ContactList;
