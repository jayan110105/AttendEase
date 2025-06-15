"use server";

import { auth } from "@/server/auth/config";
import { headers } from "next/headers";

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    return session?.user ?? null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
} 