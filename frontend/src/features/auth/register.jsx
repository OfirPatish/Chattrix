import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Eye, EyeOff, MessageSquare, Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { getRandomAvatarOptions, generateAvatar } from "../../lib/avatarUtils";
import AuthRegisterTimeline from "./components/AuthRegisterTimeline";
import InputField from "../../shared/components/ui/InputField";
import Button from "../../shared/components/ui/Button";
import { validateRegisterForm } from "../../shared/utils/validation";
import { useFormState } from "../../shared/hooks/useFormState";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, isRegistering } = useAuthStore();

  const {
    values: formData,
    handleInputChange,
    setFieldErrors,
  } = useFormState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateRegisterForm(formData)) {
      // Generate random avatar
      const avatarOptions = getRandomAvatarOptions();
      const avatarDataUri = generateAvatar(avatarOptions);

      // Add avatar to registration data
      register({
        ...formData,
        profilePic: avatarDataUri,
      });
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              type="text"
              label="Username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleInputChange}
              name="username"
              icon={<User />}
            />

            <InputField
              type="email"
              label="Email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              name="email"
              icon={<Mail />}
            />

            <InputField
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Create a secure password"
              value={formData.password}
              onChange={handleInputChange}
              name="password"
              icon={<Lock />}
              rightIcon={showPassword ? <EyeOff /> : <Eye />}
              onRightIconClick={() => setShowPassword(!showPassword)}
            />

            <Button type="submit" primary fullWidth loading={isRegistering} loadingText="Creating account...">
              Create Account
            </Button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthRegisterTimeline
        title="Get Started with Chattrix!"
        subtitle="Create your account and join the conversation."
      />
    </div>
  );
};
export default Register;
