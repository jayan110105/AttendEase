import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { employees, employeeRoles, roles, users } from "@/server/db/schema";
import type { RoleName, Employee, Role } from "@/server/db/schema";

export interface EmployeeWithRoles {
  employee: Employee;
  roles: Role[];
}

export interface UserEmployee {
  user: {
    id: string;
    name: string;
    email: string;
    employeeId?: string;
  };
  employee?: Employee;
  roles: Role[];
}

/**
 * Get employee by ID with all assigned roles
 */
export async function getEmployeeWithRoles(employeeId: string): Promise<EmployeeWithRoles | null> {
  try {
    // Get employee
    const employee = await db.query.employees.findFirst({
      where: eq(employees.employeeId, employeeId),
    });

    if (!employee) return null;

    // Get employee roles
    const employeeRolesList = await db
      .select({
        role: roles,
      })
      .from(employeeRoles)
      .innerJoin(roles, eq(employeeRoles.roleId, roles.roleId))
      .where(eq(employeeRoles.employeeId, employeeId));

    return {
      employee,
      roles: employeeRolesList.map(er => er.role),
    };
  } catch (error) {
    console.error("Error fetching employee with roles:", error);
    return null;
  }
}

/**
 * Get user with employee and role information
 */
export async function getUserEmployee(userId: string): Promise<UserEmployee | null> {
  try {
    // Get user
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) return null;

    let employee: Employee | undefined;
    let userRoles: Role[] = [];

    // If user has an employeeId, fetch employee and roles
    if (user.employeeId) {
      const employeeWithRoles = await getEmployeeWithRoles(user.employeeId);
      if (employeeWithRoles) {
        employee = employeeWithRoles.employee;
        userRoles = employeeWithRoles.roles;
      }
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        employeeId: user.employeeId ?? undefined,
      },
      employee,
      roles: userRoles,
    };
  } catch (error) {
    console.error("Error fetching user employee:", error);
    return null;
  }
}

/**
 * Link a user to an employee
 */
export async function linkUserToEmployee(userId: string, employeeId: string): Promise<boolean> {
  try {
    // Verify employee exists
    const employee = await db.query.employees.findFirst({
      where: eq(employees.employeeId, employeeId),
    });

    if (!employee) return false;

    // Update user with employeeId
    await db
      .update(users)
      .set({ employeeId })
      .where(eq(users.id, userId));

    return true;
  } catch (error) {
    console.error("Error linking user to employee:", error);
    return false;
  }
}

/**
 * Get employee by email (useful for registration/login)
 */
export async function getEmployeeByEmail(email: string): Promise<Employee | null> {
  try {
    const employee = await db.query.employees.findFirst({
      where: eq(employees.email, email),
    });

    return employee ?? null;
  } catch (error) {
    console.error("Error fetching employee by email:", error);
    return null;
  }
}

/**
 * Get user's highest role (for permission checking)
 */
export function getHighestRole(roles: Role[]): RoleName | undefined {
  if (!roles.length) return undefined;

  const roleHierarchy: Record<RoleName, number> = {
    "clerk": 1,
    "faculty": 2,
    "ccc": 3,
    "hod": 4,
    "admin": 5,
  };

  let highestRole: RoleName | undefined;
  let highestLevel = 0;

  for (const role of roles) {
    const level = roleHierarchy[role.roleName];
    if (level > highestLevel) {
      highestLevel = level;
      highestRole = role.roleName;
    }
  }

  return highestRole;
}

/**
 * Check if user has specific role
 */
export function hasRole(roles: Role[], targetRole: RoleName): boolean {
  return roles.some(role => role.roleName === targetRole);
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(roles: Role[], targetRoles: RoleName[]): boolean {
  return roles.some(role => targetRoles.includes(role.roleName));
} 