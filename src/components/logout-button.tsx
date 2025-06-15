"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LogoutButtonProps {
  children?: React.ReactNode;
  className?: string;
  redirectTo?: string;
  variant?: "button" | "link";
}

export function LogoutButton({ 
  children = "Logout", 
  className,
  redirectTo = "/login",
  variant = "button"
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push(redirectTo);
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: redirect anyway in case of error
      router.push(redirectTo);
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  const defaultClassName = variant === "link" 
    ? "text-red-600 hover:text-red-800 underline cursor-pointer"
    : "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors";

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={className ?? defaultClassName}
    >
      {isLoading ? "Signing out..." : children}
    </button>
  );
} 