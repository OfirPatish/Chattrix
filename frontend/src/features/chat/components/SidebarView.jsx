import { useEffect, useState } from "react";
import { useChatStore } from "../../../store/useChatStore";
import { useAuthStore } from "../../../store/useAuthStore";
import SidebarSkeleton from "../../../shared/components/skeletons/SidebarSkeleton";
import { useNavigate } from "react-router-dom";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarMobileHeader from "./sidebar/SidebarMobileHeader";
import SearchInput from "./sidebar/SearchInput";
import ContactList from "./sidebar/ContactList";

const Sidebar = ({ fullWidth = false }) => {
  const { getUsers, users, isUsersLoading } = useChatStore();
  const { authUser } = useAuthStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  // Detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, [authUser, navigate]);

  useEffect(() => {
    if (authUser) {
      getUsers();
    }
  }, [getUsers, authUser]);

  // If no auth user, don't render content
  if (!authUser) {
    return null;
  }

  // Filter users based on search query only
  const filteredUsers = users.filter((user) => {
    return user.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (isUsersLoading) return <SidebarSkeleton fullWidth={fullWidth} />;

  return (
    <aside
      className={`h-full border-r border-base-300 flex flex-col transition-all duration-200 overflow-hidden ${
        fullWidth ? "w-full" : "min-w-[72px] w-28 sm:w-40 lg:w-72"
      }`}
    >
      {/* Desktop header */}
      <SidebarHeader />

      {/* Mobile header */}
      <SidebarMobileHeader setShowSearch={setShowSearch} />

      {/* Desktop search */}
      <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Mobile search - Only visible when showSearch is true */}
      <SearchInput
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isMobile={true}
        showSearch={showSearch}
        setShowSearch={setShowSearch}
      />

      {/* Contacts list */}
      <ContactList filteredUsers={filteredUsers} searchQuery={searchQuery} />
    </aside>
  );
};

export default Sidebar;
