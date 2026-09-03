ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "tc_bookings" DROP COLUMN "student_age";--> statement-breakpoint
ALTER TABLE "tc_bookings" DROP COLUMN "gender";--> statement-breakpoint
ALTER TABLE "tc_bookings" DROP COLUMN "school";--> statement-breakpoint
ALTER TABLE "tc_bookings" DROP COLUMN "district";--> statement-breakpoint
ALTER TABLE "tc_bookings" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "tc_bookings" DROP COLUMN "selected_program";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password_hash";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "must_change_password";