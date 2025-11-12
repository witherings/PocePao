CREATE TABLE "categories" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"name_de" text NOT NULL,
	"icon" text DEFAULT '🥗' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"filename" text NOT NULL,
	"uploaded_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ingredients" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"name_de" text NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"description_de" text,
	"image" text NOT NULL,
	"price" numeric(10, 2),
	"available" integer DEFAULT 1 NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
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
CREATE TABLE "order_items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" varchar NOT NULL,
	"menu_item_id" varchar,
	"name" text NOT NULL,
	"name_de" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"quantity" integer NOT NULL,
	"size" text,
	"customization" text
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"pickup_time" text,
	"table_number" text,
	"service_type" text NOT NULL,
	"comment" text,
	"total" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"guests" integer NOT NULL,
	"phone" text NOT NULL,
	"date" text NOT NULL,
	"time" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE no action ON UPDATE no action;