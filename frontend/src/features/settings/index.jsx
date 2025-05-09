import { useThemeStore } from "../../store/useThemeStore";
import { useAuthStore } from "../../store/useAuthStore";
import ThemeSelector from "./components/ThemeSelector";
import SettingsAlert from "./components/SettingsAlert";
import ChatPreview from "./components/ChatPreview";

const PREVIEW_MESSAGES = [
  {
    id: 1,
    content: "Hey! How's it going?",
    isSent: false,
    createdAt: "12:00 PM",
  },
  {
    id: 2,
    content: "I'm doing great! Just working on some new features.",
    isSent: true,
    createdAt: "12:01 PM",
  },
  {
    id: 3,
    content: "Check out this image!",
    isSent: false,
    imageUrl: "https://picsum.photos/200/300",
    createdAt: "12:02 PM",
  },
];

const Settings = () => {
  const { theme, setTheme } = useThemeStore();
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen bg-base-200 pt-24 pb-8 px-4 w-full overflow-x-hidden">
      <div className="container mx-auto max-w-4xl">
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <SettingsAlert authUser={authUser} />
            <h2 className="card-title mb-2">Theme</h2>
            <p className="text-sm text-base-content/70 mb-4">Choose a theme for your chat interface</p>
            <ThemeSelector theme={theme} setTheme={setTheme} />
            <h3 className="text-lg font-semibold mb-3">Preview</h3>
            <ChatPreview />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Settings;
