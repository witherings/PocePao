CREATE TABLE "admin_users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "published_snapshot" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"current_snapshot_id" varchar,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "snapshot_gallery_images" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"snapshot_id" varchar NOT NULL,
	"url" text NOT NULL,
	"filename" text NOT NULL,
	"caption" text
);
--> statement-breakpoint
CREATE TABLE "snapshot_menu_items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"snapshot_id" varchar NOT NULL,
	"name" text NOT NULL,
	"name_de" text NOT NULL,
	"description" text NOT NULL,
	"description_de" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"price_small" numeric(10, 2),
	"price_large" numeric(10, 2),
	"image" text NOT NULL,
	"category_id" varchar NOT NULL,
	"available" integer DEFAULT 1 NOT NULL,
	"popular" integer DEFAULT 0 NOT NULL,
	"protein" text,
	"marinade" text,
	"ingredients" text[],
	"sauce" text,
	"toppings" text[],
	"allergens" text[],
	"has_size_options" integer DEFAULT 0 NOT NULL,
	"is_custom_bowl" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "snapshot_static_content" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"snapshot_id" varchar NOT NULL,
	"page" text NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "snapshots" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_published" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar
);
--> statement-breakpoint
ALTER TABLE "published_snapshot" ADD CONSTRAINT "published_snapshot_current_snapshot_id_snapshots_id_fk" FOREIGN KEY ("current_snapshot_id") REFERENCES "public"."snapshots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snapshot_gallery_images" ADD CONSTRAINT "snapshot_gallery_images_snapshot_id_snapshots_id_fk" FOREIGN KEY ("snapshot_id") REFERENCES "public"."snapshots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snapshot_menu_items" ADD CONSTRAINT "snapshot_menu_items_snapshot_id_snapshots_id_fk" FOREIGN KEY ("snapshot_id") REFERENCES "public"."snapshots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snapshot_static_content" ADD CONSTRAINT "snapshot_static_content_snapshot_id_snapshots_id_fk" FOREIGN KEY ("snapshot_id") REFERENCES "public"."snapshots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snapshots" ADD CONSTRAINT "snapshots_created_by_admin_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;