DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('admin', 'staff');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "attendease_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
DROP TABLE "attendease_verification_token";--> statement-breakpoint
ALTER TABLE "attendease_account" DROP CONSTRAINT "attendease_account_user_id_attendease_user_id_fk";
--> statement-breakpoint
ALTER TABLE "attendease_session" DROP CONSTRAINT "attendease_session_user_id_attendease_user_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "account_user_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "session_user_id_idx";--> statement-breakpoint
ALTER TABLE "attendease_account" DROP CONSTRAINT "attendease_account_provider_provider_account_id_pk";--> statement-breakpoint
ALTER TABLE "attendease_account" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "attendease_account" ALTER COLUMN "scope" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "attendease_post" ALTER COLUMN "created_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "attendease_session" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "attendease_user" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "attendease_user" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "attendease_user" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "attendease_user" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "attendease_user" ALTER COLUMN "email_verified" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "attendease_user" ALTER COLUMN "email_verified" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "attendease_user" ALTER COLUMN "email_verified" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "attendease_user" ALTER COLUMN "image" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "attendease_account" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "attendease_account" ADD COLUMN "account_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "attendease_account" ADD COLUMN "provider_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "attendease_account" ADD COLUMN "access_token_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "attendease_account" ADD COLUMN "refresh_token_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "attendease_account" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "attendease_account" ADD COLUMN "created_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "attendease_account" ADD COLUMN "updated_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "attendease_session" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "attendease_session" ADD COLUMN "expires_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "attendease_session" ADD COLUMN "token" text NOT NULL;--> statement-breakpoint
ALTER TABLE "attendease_session" ADD COLUMN "created_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "attendease_session" ADD COLUMN "updated_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "attendease_session" ADD COLUMN "ip_address" text;--> statement-breakpoint
ALTER TABLE "attendease_session" ADD COLUMN "user_agent" text;--> statement-breakpoint
ALTER TABLE "attendease_user" ADD COLUMN "role" "role" DEFAULT 'staff' NOT NULL;--> statement-breakpoint
ALTER TABLE "attendease_user" ADD COLUMN "created_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "attendease_user" ADD COLUMN "updated_at" timestamp NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attendease_account" ADD CONSTRAINT "attendease_account_user_id_attendease_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."attendease_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attendease_session" ADD CONSTRAINT "attendease_session_user_id_attendease_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."attendease_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "attendease_account" DROP COLUMN IF EXISTS "type";--> statement-breakpoint
ALTER TABLE "attendease_account" DROP COLUMN IF EXISTS "provider";--> statement-breakpoint
ALTER TABLE "attendease_account" DROP COLUMN IF EXISTS "provider_account_id";--> statement-breakpoint
ALTER TABLE "attendease_account" DROP COLUMN IF EXISTS "expires_at";--> statement-breakpoint
ALTER TABLE "attendease_account" DROP COLUMN IF EXISTS "token_type";--> statement-breakpoint
ALTER TABLE "attendease_account" DROP COLUMN IF EXISTS "session_state";--> statement-breakpoint
ALTER TABLE "attendease_session" DROP COLUMN IF EXISTS "session_token";--> statement-breakpoint
ALTER TABLE "attendease_session" DROP COLUMN IF EXISTS "expires";--> statement-breakpoint
ALTER TABLE "attendease_session" ADD CONSTRAINT "attendease_session_token_unique" UNIQUE("token");--> statement-breakpoint
ALTER TABLE "attendease_user" ADD CONSTRAINT "attendease_user_email_unique" UNIQUE("email");