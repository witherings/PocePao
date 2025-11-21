-- CRITICAL: Add missing snapshot_ingredients and snapshot_categories tables
-- These tables were missing from migration 0001 but are required by the application

-- Add snapshot_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS "snapshot_categories" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "snapshot_id" varchar NOT NULL REFERENCES snapshots(id) ON DELETE CASCADE,
  "name" text NOT NULL,
  "name_de" text NOT NULL,
  "icon" text DEFAULT '🥗' NOT NULL,
  "order" integer DEFAULT 0 NOT NULL,
  "original_category_id" varchar NOT NULL
);

-- Add snapshot_ingredients table - CRITICAL for snapshot creation
CREATE TABLE IF NOT EXISTS "snapshot_ingredients" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "snapshot_id" varchar NOT NULL REFERENCES snapshots(id) ON DELETE CASCADE,
  "name" text NOT NULL,
  "name_de" text NOT NULL,
  "ingredient_type" text NOT NULL,
  "description" text,
  "description_de" text,
  "image" text,
  "price" numeric(10, 2),
  "price_small" numeric(10, 2),
  "price_standard" numeric(10, 2),
  "available" integer DEFAULT 1 NOT NULL,
  "original_ingredient_id" varchar NOT NULL
);

-- Add product_variants table if it doesn't exist
CREATE TABLE IF NOT EXISTS "product_variants" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "menu_item_id" varchar NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  "name" text NOT NULL,
  "name_de" text NOT NULL,
  "type" text NOT NULL,
  "order" integer DEFAULT 0 NOT NULL,
  "available" integer DEFAULT 1 NOT NULL
);

-- Ensure all required columns exist in ingredients table
ALTER TABLE "ingredients" 
  ADD COLUMN IF NOT EXISTS "price_small" numeric(10, 2),
  ADD COLUMN IF NOT EXISTS "price_standard" numeric(10, 2);

-- Ensure all required columns exist in menu_items table  
ALTER TABLE "menu_items"
  ADD COLUMN IF NOT EXISTS "has_size_options" integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "is_custom_bowl" integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "enable_base_selection" integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "has_variants" integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "variant_type" text,
  ADD COLUMN IF NOT EXISTS "requires_variant_selection" integer DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_snapshot_categories_snapshot_id" ON snapshot_categories(snapshot_id);
CREATE INDEX IF NOT EXISTS "idx_snapshot_ingredients_snapshot_id" ON snapshot_ingredients(snapshot_id);
CREATE INDEX IF NOT EXISTS "idx_product_variants_menu_item_id" ON product_variants(menu_item_id);

-- Gallery images - ensure type column exists  
ALTER TABLE "gallery_images"
  ADD COLUMN IF NOT EXISTS "type" text DEFAULT 'main';
