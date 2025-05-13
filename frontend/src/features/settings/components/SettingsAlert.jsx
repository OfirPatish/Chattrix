import { Info } from "lucide-react";
import { Link } from "react-router-dom";

const SettingsAlert = ({ authUser }) => {
  if (authUser) return null;
  return (
    <div className="alert alert-info mb-4">
      <Info className="size-5" />
      <div>
        <p>
          You're viewing settings as a guest.{" "}
          <Link to="/login" className="link link-primary">
            Login
          </Link>{" "}
          to access all features.
        </p>
      </div>
    </div>
  );
};

export default SettingsAlert;
