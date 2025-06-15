"use server";

import { auth } from "@/server/auth/config";
import { headers } from "next/headers";
import { getUserEmployee, getEmployeeByEmail, linkUserToEmployee, getHighestRole } from "@/lib/employee-service";
import type { RoleName } from "@/server/db/schema";

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

export async function getCurrentUserWithEmployee() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session?.user) return null;

    const userEmployee = await getUserEmployee(session.user.id);
    return userEmployee;
  } catch (error) {
    console.error("Get current user with employee error:", error);
    return null;
  }
}

export async function getCurrentUserRole(): Promise<RoleName | undefined> {
  try {
    const userEmployee = await getCurrentUserWithEmployee();
    if (!userEmployee) return undefined;

    return getHighestRole(userEmployee.roles);
  } catch (error) {
    console.error("Get current user role error:", error);
    return undefined;
  }
}

export async function linkCurrentUserToEmployee(employeeId: string): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) return false;

    return await linkUserToEmployee(user.id, employeeId);
  } catch (error) {
    console.error("Link current user to employee error:", error);
    return false;
  }
}

export async function autoLinkUserByEmail(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user || user.employeeId) return false; // Already linked or no user

    const employee = await getEmployeeByEmail(user.email);
    if (!employee) return false; // No matching employee

    return await linkUserToEmployee(user.id, employee.employeeId);
  } catch (error) {
    console.error("Auto link user by email error:", error);
    return false;
  }
} 