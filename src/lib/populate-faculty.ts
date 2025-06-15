import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { db } from "@/server/db";
import { employees, roles, employeeRoles } from "@/server/db/schema";
import type { EmployeeType, Grade, RoleName } from "@/server/db/schema";

interface FacultyRecord {
  slNo: string;
  name: string;
  designation: string;
  email: string;
  roomNo: string;
}

function parseCSV(csvContent: string): FacultyRecord[] {
  const lines = csvContent.split('\n');
  const records: FacultyRecord[] = [];
  
  // Skip header lines (first 2 lines)
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;
    
    const columns = line.split(',');
    if (columns.length < 4) continue;
    
    const slNo = columns[0]?.trim() ?? '';
    const name = columns[1]?.trim() ?? '';
    const designation = columns[2]?.trim() ?? '';
    const email = columns[3]?.trim() ?? '';
    const roomNo = columns[4]?.trim() ?? '';
    
    if (slNo && name && email) {
      records.push({ slNo, name, designation, email, roomNo });
    }
  }
  
  return records;
}

function mapDesignationToGrade(designation: string): Grade | null {
  const lowerDesignation = designation.toLowerCase();
  
  if (lowerDesignation.includes('professor & hod') || lowerDesignation.includes('professor')) {
    return 'professor';
  }
  if (lowerDesignation.includes('additional professor')) {
    return 'professor';
  }
  if (lowerDesignation.includes('associate professor')) {
    return 'associate-professor';
  }
  if (lowerDesignation.includes('assistant professor')) {
    return 'asst-professor';
  }
  if (lowerDesignation.includes('professor of practice')) {
    return 'professor-of-practice';
  }
  
  return 'asst-professor'; // Default
}

function mapDesignationToRoles(designation: string): RoleName[] {
  const lowerDesignation = designation.toLowerCase();
  const roles: RoleName[] = [];
  
  // All faculty get faculty role
  roles.push('faculty');
  
  // HOD gets admin and hod roles
  if (lowerDesignation.includes('hod')) {
    roles.push('admin', 'hod');
  }
  
  // Professors and Additional Professors get CCC role
  if (lowerDesignation.includes('professor') && 
      !lowerDesignation.includes('assistant') && 
      !lowerDesignation.includes('associate')) {
    roles.push('ccc');
  }
  
  return roles;
}

function parseName(fullName: string): { firstName: string; lastName: string } {
  // Remove titles like Dr., Mr., Ms.
  const cleanName = fullName
    .replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s*/i, '')
    .trim();
  
  const nameParts = cleanName.split(' ').filter(part => part.length > 0);
  
  if (nameParts.length === 1) {
    return { firstName: nameParts[0]!, lastName: '' };
  }
  
  const firstName = nameParts[0]!;
  const lastName = nameParts.slice(1).join(' ');
  
  return { firstName, lastName };
}

function generateEmployeeId(slNo: string): string {
  // Convert sl no to 3-digit format: 1 -> CSE001
  const paddedNo = slNo.padStart(3, '0');
  return `CSE${paddedNo}`;
}

export async function populateFacultyFromCSV(): Promise<void> {
  try {
    console.log("📚 Starting faculty database population...");
    
    // Read and parse CSV file
    const csvPath = join(process.cwd(), 'FLIST.csv');
    const csvContent = readFileSync(csvPath, 'utf-8');
    const facultyRecords = parseCSV(csvContent);
    
    console.log(`📄 Parsed ${facultyRecords.length} faculty records from CSV`);
    
    // First ensure roles exist
    console.log("🔐 Ensuring roles exist...");
    const existingRoles = await db.select().from(roles);
    
    if (existingRoles.length === 0) {
      await db.insert(roles).values([
        { roleName: "admin", description: "System Administrator" },
        { roleName: "hod", description: "Head of Department" },
        { roleName: "ccc", description: "Course Coordination Committee" },
        { roleName: "faculty", description: "Faculty Member" },
        { roleName: "clerk", description: "Administrative Clerk" },
      ]);
      console.log("✅ Created default roles");
    }
    
    // Get all roles for mapping
    const allRoles = await db.select().from(roles);
    const roleMap = new Map(allRoles.map(role => [role.roleName, role.roleId]));
    
    // Prepare employee data
    const employeeData = facultyRecords.map(record => {
      const { firstName, lastName } = parseName(record.name);
      const grade = mapDesignationToGrade(record.designation);
      const employeeId = generateEmployeeId(record.slNo);
      
      return {
        employeeId,
        employeeType: 'teaching' as EmployeeType,
        grade,
        firstName,
        lastName,
        email: record.email,
        mobile: null,
        location: record.roomNo || null,
      };
    });
    
    // Insert employees in batches
    console.log("👥 Inserting faculty employees...");
    const insertedEmployees = await db.insert(employees).values(employeeData).returning();
    console.log(`✅ Inserted ${insertedEmployees.length} faculty members`);
    
    // Prepare role assignments
    const roleAssignments: Array<{ employeeId: string; roleId: number }> = [];
    
    for (const record of facultyRecords) {
      const employeeId = generateEmployeeId(record.slNo);
      const assignedRoles = mapDesignationToRoles(record.designation);
      
      for (const roleName of assignedRoles) {
        const roleId = roleMap.get(roleName);
        if (roleId) {
          roleAssignments.push({ employeeId, roleId });
        }
      }
    }
    
    // Insert role assignments
    console.log("🎭 Assigning roles to faculty...");
    await db.insert(employeeRoles).values(roleAssignments);
    console.log(`✅ Created ${roleAssignments.length} role assignments`);
    
    // Print summary
    console.log("\n📊 Faculty Population Summary:");
    console.log(`- Total Faculty: ${insertedEmployees.length}`);
    console.log(`- Role Assignments: ${roleAssignments.length}`);
    
    // Count by designation
    const designationCounts = facultyRecords.reduce((acc, record) => {
      const designation = record.designation;
      acc[designation] = (acc[designation] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log("\n📈 Faculty by Designation:");
    Object.entries(designationCounts).forEach(([designation, count]) => {
      console.log(`- ${designation}: ${count}`);
    });
    
    // Find HOD
    const hod = facultyRecords.find(r => r.designation.toLowerCase().includes('hod'));
    if (hod) {
      console.log(`\n👑 HOD: ${hod.name} (${hod.email})`);
    }
    
    console.log("\n🎉 Faculty database population completed successfully!");
    
  } catch (error) {
    console.error("❌ Error populating faculty database:", error);
    throw error;
  }
}

// Export for use in scripts 