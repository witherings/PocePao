CREATE TABLE "snapshot_categories" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"snapshot_id" varchar NOT NULL,
	"name" text NOT NULL,
	"name_de" text NOT NULL,
	"icon" text DEFAULT '🥗' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"original_category_id" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "snapshot_categories" ADD CONSTRAINT "snapshot_categories_snapshot_id_snapshots_id_fk" FOREIGN KEY ("snapshot_id") REFERENCES "public"."snapshots"("id") ON DELETE cascade ON UPDATE no action;