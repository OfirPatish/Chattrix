"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import useAuthStore from "@/store/authStore";
import AuthLayout from "@/components/auth/AuthLayout";
import FormInput from "@/components/auth/FormInput";
import PasswordInput from "@/components/auth/PasswordInput";
import ErrorDisplay from "@/components/auth/ErrorDisplay";
import SubmitButton from "@/components/auth/SubmitButton";
import { User, Mail, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const {
    register: registerUser,
    isLoading,
    error,
    isAuthenticated,
    clearError,
  } = useAuthStore();
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const username = watch("username");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/chat");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data) => {
    clearError();
    const result = await registerUser(data.username, data.email, data.password);
    if (!result.success && result.error) {
      // Error is handled by store
    }
  };

  const passwordMatch =
    password && confirmPassword ? password === confirmPassword : null;
  const passwordLengthValid = password ? password.length >= 6 : null;
  const usernameLengthValid = username ? username.length >= 3 : null;

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join Chattrix and start chatting"
      footerText="By creating an account, you agree to our Terms of Service and Privacy Policy"
    >
      <ErrorDisplay error={error} />

      <form
        onSubmit={handleFormSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        <FormInput
          label="Username"
          icon={User}
          type="text"
          placeholder="Your username"
          error={errors.username?.message}
          rightElement={
            username && (
              <span
                className={`label-text-alt text-xs sm:text-sm ${
                  usernameLengthValid ? "text-success" : "text-error"
                }`}
              >
                {usernameLengthValid && (
                  <CheckCircle className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                )}
                {username && username.length < 3 && username.length > 0
                  ? "Min 3 chars"
                  : ""}
              </span>
            )
          }
          className={
            username && usernameLengthValid
              ? "input-success"
              : username && !usernameLengthValid
              ? "input-error"
              : ""
          }
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
            maxLength: {
              value: 20,
              message: "Username must be less than 20 characters",
            },
          })}
        />

        <FormInput
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="Your email address"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />

        <PasswordInput
          label="Password"
          placeholder="Your password"
          error={errors.password?.message}
          rightElement={
            password && (
              <span
                className={`label-text-alt text-xs sm:text-sm ${
                  passwordLengthValid ? "text-success" : "text-error"
                }`}
              >
                {passwordLengthValid && (
                  <CheckCircle className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                )}
                {passwordLengthValid ? "Valid" : "Min 6"}
              </span>
            )
          }
          className={
            password && passwordLengthValid
              ? "input-success"
              : password && !passwordLengthValid
              ? "input-error"
              : ""
          }
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          rightElement={
            confirmPassword &&
            passwordMatch !== null && (
              <span
                className={`label-text-alt text-xs sm:text-sm ${
                  passwordMatch ? "text-success" : "text-error"
                }`}
              >
                {passwordMatch && (
                  <>
                    <CheckCircle className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Match
                  </>
                )}
                {!passwordMatch && "No match"}
              </span>
            )
          }
          className={
            confirmPassword && passwordMatch === true
              ? "input-success"
              : confirmPassword && passwordMatch === false
              ? "input-error"
              : ""
          }
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
        />

        <SubmitButton isLoading={isLoading} loadingText="Creating account...">
          Create Account
        </SubmitButton>
      </form>

      <div className="divider my-4 sm:my-6 text-base-content/40 text-xs sm:text-sm">
        OR
      </div>

      <p className="text-center text-xs sm:text-sm text-base-content/60">
        Already have an account?{" "}
        <Link
          href="/login"
          className="link link-primary font-semibold hover:underline"
        >
          Sign in instead
        </Link>
      </p>
    </AuthLayout>
  );
}
