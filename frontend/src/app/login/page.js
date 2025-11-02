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
import { Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, isAuthenticated, clearError } =
    useAuthStore();
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/chat");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data) => {
    clearError();
    const result = await login(data.email, data.password);
    if (!result.success && result.error) {
      // Error is handled by store
    }
  };

  const currentError = error;

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to Chattrix"
      footerText="By signing in, you agree to our Terms of Service and Privacy Policy"
    >
      <ErrorDisplay error={currentError} />

      <form
        onSubmit={handleFormSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
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
          {...register("password", {
            required: "Password is required",
          })}
        />

        <SubmitButton isLoading={isLoading} loadingText="Signing in...">
          Sign In
        </SubmitButton>
      </form>

      <div className="divider my-4 sm:my-6 text-base-content/40 text-xs sm:text-sm">
        OR
      </div>

      <p className="text-center text-xs sm:text-sm text-base-content/60">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="link link-primary font-semibold hover:underline"
        >
          Create one now
        </Link>
      </p>
    </AuthLayout>
  );
}
