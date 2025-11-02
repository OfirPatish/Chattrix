import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

/**
 * Hook to handle authentication redirects
 * @param {Object} options - Configuration options
 * @param {string} options.redirectIfAuthenticated - Redirect to this route if user is authenticated (e.g., "/chat")
 * @param {string} options.redirectIfNotAuthenticated - Redirect to this route if user is not authenticated (e.g., "/login")
 */
export function useAuthRedirect({
  redirectIfAuthenticated,
  redirectIfNotAuthenticated,
} = {}) {
  const router = useRouter();
  const { verifyAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await verifyAuth();

      if (redirectIfAuthenticated && isValid) {
        router.push(redirectIfAuthenticated);
      } else if (redirectIfNotAuthenticated && !isValid) {
        router.push(redirectIfNotAuthenticated);
      }
    };

    checkAuth();
  }, [router, verifyAuth, redirectIfAuthenticated, redirectIfNotAuthenticated]);

  return { isAuthenticated };
}
