import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  text,
  timestamp,
  varchar,
  boolean,
  pgEnum,
  serial,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `attendease_${name}`);

// Define enums
export const employeeTypeEnum = pgEnum("employee_type", ["teaching", "non-teaching"]);
export const gradeEnum = pgEnum("grade", ["professor", "professor-of-practice", "associate-professor", "asst-professor"]);
export const roleEnum = pgEnum("role", ["hod", "ccc", "faculty", "admin", "clerk"]);
export const eventTypeEnum = pgEnum("event_type", ["department-meeting", "techtalk", "workshop"]);
export const eventStatusEnum = pgEnum("event_status", ["created", "inprogress", "completed", "cancelled"]);
export const participantTypeEnum = pgEnum("participant_type", ["student", "teaching", "non-teaching", "external"]);

// EMPLOYEE table
export const employees = createTable("employee", {
  employeeId: text("employee_id").primaryKey(),
  employeeType: employeeTypeEnum("employee_type").notNull(),
  grade: gradeEnum("grade"),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  mobile: varchar("mobile", { length: 15 }),
  location: varchar("location", { length: 255 }),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

// ROLE table
export const roles = createTable("role", {
  roleId: serial("role_id").primaryKey(),
  roleName: roleEnum("role_name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
});

// EMPLOYEE_ROLE table (junction table for many-to-many relationship)
export const employeeRoles = createTable("employee_role", {
  id: serial("id").primaryKey(),
  employeeId: text("employee_id")
    .notNull()
    .references(() => employees.employeeId, { onDelete: "cascade" }),
  roleId: integer("role_id")
    .notNull()
    .references(() => roles.roleId, { onDelete: "cascade" }),
  assignedAt: timestamp("assigned_at").$defaultFn(() => new Date()).notNull(),
}, (table) => ({
  employeeRoleIdx: index("employee_role_idx").on(table.employeeId, table.roleId),
}));

// EVENT table
export const events = createTable("event", {
  eventId: serial("event_id").primaryKey(),
  eventType: eventTypeEnum("event_type").notNull(),
  eventDate: timestamp("event_date").notNull(),
  eventTitle: varchar("event_title", { length: 255 }).notNull(),
  eventDescription: text("event_description"),
  eventStatus: eventStatusEnum("event_status").default("created").notNull(),
  eventDelegatedTo: text("event_delegated_to")
    .references(() => employees.employeeId, { onDelete: "set null" }),
  createdBy: text("created_by")
    .notNull()
    .references(() => employees.employeeId),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
}, (table) => ({
  eventDateIdx: index("event_date_idx").on(table.eventDate),
  eventStatusIdx: index("event_status_idx").on(table.eventStatus),
  createdByIdx: index("event_created_by_idx").on(table.createdBy),
}));

// EVENT_ATTENDANCE table
export const eventAttendance = createTable("event_attendance", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id")
    .notNull()
    .references(() => events.eventId, { onDelete: "cascade" }),
  participantId: varchar("participant_id", { length: 255 }).notNull(), // Can be registration_id/employee_id/mobile_number
  participantType: participantTypeEnum("participant_type").notNull(),
  createdBy: text("created_by")
    .notNull()
    .references(() => employees.employeeId),
  creationDate: timestamp("creation_date").$defaultFn(() => new Date()).notNull(),
}, (table) => ({
  eventParticipantIdx: index("event_participant_idx").on(table.eventId, table.participantId),
  eventIdIdx: index("attendance_event_id_idx").on(table.eventId),
}));

// EVENT_FEEDBACK table
export const eventFeedback = createTable("event_feedback", {
  eventFeedbackId: serial("event_feedback_id").primaryKey(),
  eventId: integer("event_id")
    .notNull()
    .references(() => events.eventId, { onDelete: "cascade" }),
  participantId: varchar("participant_id", { length: 255 }).notNull(),
  rating: integer("rating").notNull(), // 1-5 rating
  comments: text("comments"),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
}, (table) => ({
  eventFeedbackIdx: index("event_feedback_idx").on(table.eventId, table.participantId),
  ratingIdx: index("rating_idx").on(table.rating),
}));

// Better Auth Tables (keeping for authentication)
export const users = createTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").$defaultFn(() => false).notNull(),
  image: text("image"),
  employeeId: text("employee_id")
    .references(() => employees.employeeId, { onDelete: "set null" }),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

export const sessions = createTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = createTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = createTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

// Relations
export const employeesRelations = relations(employees, ({ many, one }) => ({
  employeeRoles: many(employeeRoles),
  createdEvents: many(events, { relationName: "createdEvents" }),
  delegatedEvents: many(events, { relationName: "delegatedEvents" }),
  attendanceRecords: many(eventAttendance),
  user: one(users, { fields: [employees.employeeId], references: [users.employeeId] }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  employeeRoles: many(employeeRoles),
}));

export const employeeRolesRelations = relations(employeeRoles, ({ one }) => ({
  employee: one(employees, { fields: [employeeRoles.employeeId], references: [employees.employeeId] }),
  role: one(roles, { fields: [employeeRoles.roleId], references: [roles.roleId] }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  createdBy: one(employees, { 
    fields: [events.createdBy], 
    references: [employees.employeeId],
    relationName: "createdEvents"
  }),
  delegatedTo: one(employees, { 
    fields: [events.eventDelegatedTo], 
    references: [employees.employeeId],
    relationName: "delegatedEvents"
  }),
  attendance: many(eventAttendance),
  feedback: many(eventFeedback),
}));

export const eventAttendanceRelations = relations(eventAttendance, ({ one }) => ({
  event: one(events, { fields: [eventAttendance.eventId], references: [events.eventId] }),
  createdBy: one(employees, { fields: [eventAttendance.createdBy], references: [employees.employeeId] }),
}));

export const eventFeedbackRelations = relations(eventFeedback, ({ one }) => ({
  event: one(events, { fields: [eventFeedback.eventId], references: [events.eventId] }),
}));

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  employee: one(employees, { fields: [users.employeeId], references: [employees.employeeId] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

// Types
export type Employee = typeof employees.$inferSelect;
export type Role = typeof roles.$inferSelect;
export type EmployeeRole = typeof employeeRoles.$inferSelect;
export type Event = typeof events.$inferSelect;
export type EventAttendance = typeof eventAttendance.$inferSelect;
export type EventFeedback = typeof eventFeedback.$inferSelect;
export type User = typeof users.$inferSelect;

// Enum types
export type EmployeeType = typeof employeeTypeEnum.enumValues[number];
export type Grade = typeof gradeEnum.enumValues[number];
export type RoleName = typeof roleEnum.enumValues[number];
export type EventType = typeof eventTypeEnum.enumValues[number];
export type EventStatus = typeof eventStatusEnum.enumValues[number];
export type ParticipantType = typeof participantTypeEnum.enumValues[number];
