export type Role = "admin" | "staff";

// Role-based permission checks
export function isAdmin(userRole: string | undefined): boolean {
  return userRole === "admin";
}

export function isStaff(userRole: string | undefined): boolean {
  return userRole === "staff" || userRole === "admin";
}

export function hasAdminAccess(userRole: string | undefined): boolean {
  return userRole === "admin";
}

export function hasStaffAccess(userRole: string | undefined): boolean {
  return userRole === "staff" || userRole === "admin";
}

export function getRedirectPathForRole(role: string | undefined): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "staff": 
      return "/dashboard";
    default:
      return "/login";
  }
} 