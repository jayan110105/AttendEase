import type { RoleName } from "@/server/db/schema";

export type Role = RoleName;

// Role hierarchy (higher number = more permissions)
const ROLE_HIERARCHY: Record<RoleName, number> = {
  "clerk": 1,
  "faculty": 2,
  "ccc": 3,
  "hod": 4,
  "admin": 5,
};

// Role-based permission checks
export function isAdmin(userRole: RoleName | undefined): boolean {
  return userRole === "admin";
}

export function isHOD(userRole: RoleName | undefined): boolean {
  return userRole === "hod";
}

export function isCCC(userRole: RoleName | undefined): boolean {
  return userRole === "ccc";
}

export function isFaculty(userRole: RoleName | undefined): boolean {
  return userRole === "faculty";
}

export function isClerk(userRole: RoleName | undefined): boolean {
  return userRole === "clerk";
}

// Hierarchical permission checks
export function hasAdminAccess(userRole: RoleName | undefined): boolean {
  return userRole === "admin";
}

export function hasHODAccess(userRole: RoleName | undefined): boolean {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY.hod;
}

export function hasCCCAccess(userRole: RoleName | undefined): boolean {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY.ccc;
}

export function hasFacultyAccess(userRole: RoleName | undefined): boolean {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY.faculty;
}

export function hasClerkAccess(userRole: RoleName | undefined): boolean {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY.clerk;
}

// Event management permissions
export function canCreateEvents(userRole: RoleName | undefined): boolean {
  return hasHODAccess(userRole) || hasAdminAccess(userRole);
}

export function canEditEvents(userRole: RoleName | undefined): boolean {
  return hasHODAccess(userRole) || hasAdminAccess(userRole);
}

export function canDeleteEvents(userRole: RoleName | undefined): boolean {
  return hasAdminAccess(userRole);
}

export function canManageAttendance(userRole: RoleName | undefined): boolean {
  return hasFacultyAccess(userRole);
}

export function canViewReports(userRole: RoleName | undefined): boolean {
  return hasCCCAccess(userRole);
}

export function getRedirectPathForRole(role: RoleName | undefined): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "hod":
      return "/admin";
    case "ccc":
      return "/dashboard";
    case "faculty": 
      return "/dashboard";
    case "clerk":
      return "/dashboard";
    default:
      return "/login";
  }
}

export function getRoleDisplayName(role: RoleName): string {
  switch (role) {
    case "admin":
      return "Administrator";
    case "hod":
      return "Head of Department";
    case "ccc":
      return "Course Coordination Committee";
    case "faculty":
      return "Faculty";
    case "clerk":
      return "Clerk";
    default:
      return role;
  }
} 