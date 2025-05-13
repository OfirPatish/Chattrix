import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { LogIn, LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 left-0 right-0 z-50 
    backdrop-blur-lg bg-base-100/90"
    >
      <div className="container mx-auto px-2 sm:px-4 h-12 sm:h-14 md:h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-2 sm:gap-8">
            <Link
              to={authUser ? "/" : "/login"}
              className="flex items-center gap-1.5 sm:gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-7 sm:size-8 md:size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <h1 className="text-base sm:text-lg font-bold">Chattrix</h1>
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {authUser ? (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar btn-sm sm:btn-md">
                  <div className="w-8 sm:w-10 rounded-full">
                    <img src={authUser?.profilePic || "/avatar.png"} alt="Profile" />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border border-base-300"
                >
                  <li>
                    <Link to="/profile" className="justify-between">
                      <div className="flex items-center gap-2">
                        <User className="size-4" />
                        Profile
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/settings">
                      <div className="flex items-center gap-2">
                        <Settings className="size-4" />
                        Settings
                      </div>
                    </Link>
                  </li>
                  <li>
                    <a onClick={logout}>
                      <div className="flex items-center gap-2">
                        <LogOut className="size-4" />
                        Logout
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/settings" className="btn btn-sm gap-1 sm:gap-2 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
