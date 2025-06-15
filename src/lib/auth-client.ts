import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" 
    ? (process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? window.location.origin)
    : "http://localhost:3000",
});

// Export the auth client methods following Better Auth documentation
export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession,
  getSession,
  // Additional methods from Better Auth
  resetPassword,
  forgetPassword,
} = authClient; 