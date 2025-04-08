import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, MessageSquare, Mail, Lock } from "lucide-react";
import AuthWelcomeTimeline from "./components/AuthLoginTimeline";
import InputField from "../../shared/components/ui/InputField";
import Button from "../../shared/components/ui/Button";
import { validateLoginForm } from "../../shared/utils/validation";
import { useFormState } from "../../shared/hooks/useFormState";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthStore();

  const {
    values: formData,
    handleInputChange,
    setFieldErrors,
  } = useFormState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateLoginForm(formData)) {
      login(formData);
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              name="password"
              icon={<Lock />}
              rightIcon={showPassword ? <EyeOff /> : <Eye />}
              onRightIconClick={() => setShowPassword(!showPassword)}
            />

            <Button type="submit" primary fullWidth loading={isLoggingIn} loadingText="Signing in...">
              Sign in
            </Button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Timeline Visual */}
      <AuthWelcomeTimeline
        title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}
      />
    </div>
  );
};
export default Login;
