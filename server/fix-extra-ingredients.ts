import { getDb, getPool } from "./db";

/**
 * Fix ingredients with type "extra" to proper extra_ types
 * This script updates any ingredients that were created with the old "extra" type
 * to use the correct extra_protein, extra_fresh, extra_sauce, or extra_topping types
 * 
 * Strategy:
 * 1. Find all ingredients with type "extra"
 * 2. For each, try to find a matching base ingredient with the same name
 * 3. If found, map base type to corresponding extra type
 * 4. If not found, try to infer from name or default to extra_fresh
 * 5. Update the ingredient with the correct type
 */
async function fixExtraIngredients() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not set. Make sure the database is provisioned.");
    process.exit(1);
  }

  try {
    console.log("🔄 Fixing extra ingredients...\n");

    const pool = await getPool();

    // First, check if there are any ingredients with type "extra"
    const extraIngredientsResult = await pool.query(`
      SELECT id, name, name_de, type FROM ingredients WHERE type = 'extra'
    `);

    if (extraIngredientsResult.rows.length === 0) {
      console.log("✅ No ingredients with type 'extra' found. Nothing to fix.");
      process.exit(0);
    }

    console.log(`Found ${extraIngredientsResult.rows.length} ingredients with type 'extra':`);
    extraIngredientsResult.rows.forEach((row: any) => {
      const displayName = row.name_de || row.name || `[ID: ${row.id}]`;
      console.log(`  - ${displayName} (ID: ${row.id})`);
    });

    // Check for NULL names
    const nullNameCount = extraIngredientsResult.rows.filter((row: any) => !row.name_de).length;
    if (nullNameCount > 0) {
      console.log(`\n⚠️  WARNING: ${nullNameCount} ingredients have NULL name_de.`);
      console.log(`⚠️  These will be skipped and require manual intervention.\n`);
    }

    // Get all base ingredients (protein, fresh, sauce, topping)
    const baseIngredientsResult = await pool.query(`
      SELECT id, name, name_de, type 
      FROM ingredients 
      WHERE type IN ('protein', 'fresh', 'sauce', 'topping')
    `);

    const baseIngredients = baseIngredientsResult.rows;
    
    // Map base types to extra types
    const typeMap: Record<string, string> = {
      'protein': 'extra_protein',
      'fresh': 'extra_fresh',
      'sauce': 'extra_sauce',
      'topping': 'extra_topping'
    };

    console.log("\n🔄 Starting migration...\n");

    let updatedCount = 0;
    let skippedCount = 0;
    let matchedByName = 0;
    let inferredFromKeywords = 0;
    let defaultedToFresh = 0;
    const needsReview: Array<{ name: string; type: string; reason: string }> = [];

    for (const extraIng of extraIngredientsResult.rows) {
      // Skip ingredients with NULL name_de
      if (!extraIng.name_de) {
        console.error(`❌ Skipping ingredient ID ${extraIng.id}: name_de is NULL`);
        skippedCount++;
        needsReview.push({
          name: `[ID: ${extraIng.id}]`,
          type: 'extra (unchanged)',
          reason: 'name_de is NULL - cannot automatically fix'
        });
        continue;
      }

      // Try to find matching base ingredient by name
      const matchingBase = baseIngredients.find(
        (base: any) => base.name_de && base.name_de.toLowerCase() === extraIng.name_de.toLowerCase()
      );

      let newType: string;
      let matchMethod: string;
      
      if (matchingBase) {
        // Found matching base ingredient - use its type
        newType = typeMap[matchingBase.type as string];
        matchMethod = 'matched_by_name';
        matchedByName++;
        console.log(`✓ ${extraIng.name_de}: Found base ingredient with type '${matchingBase.type}' → '${newType}'`);
      } else {
        // No matching base ingredient - try to infer from name
        const nameLower = extraIng.name_de.toLowerCase();
        
        if (nameLower.includes('protein') || nameLower.includes('tofu') || nameLower.includes('falafel') || 
            nameLower.includes('hähnchen') || nameLower.includes('lachs') || nameLower.includes('thunfisch') ||
            nameLower.includes('garnelen') || nameLower.includes('chicken') || nameLower.includes('salmon')) {
          newType = 'extra_protein';
          matchMethod = 'inferred_protein';
          inferredFromKeywords++;
        } else if (nameLower.includes('sauce') || nameLower.includes('mayo') || nameLower.includes('dressing')) {
          newType = 'extra_sauce';
          matchMethod = 'inferred_sauce';
          inferredFromKeywords++;
        } else if (nameLower.includes('topping') || nameLower.includes('sesam') || nameLower.includes('nori') ||
                   nameLower.includes('zwiebel') || nameLower.includes('onion')) {
          newType = 'extra_topping';
          matchMethod = 'inferred_topping';
          inferredFromKeywords++;
        } else {
          // Default to extra_fresh for vegetables and other ingredients
          newType = 'extra_fresh';
          matchMethod = 'defaulted_to_fresh';
          defaultedToFresh++;
          needsReview.push({
            name: extraIng.name_de,
            type: newType,
            reason: 'Could not match by name or infer from keywords - defaulted to extra_fresh'
          });
        }
        
        console.log(`⚠ ${extraIng.name_de}: No base found, inferred type → '${newType}' (${matchMethod})`);
      }

      // Update the ingredient
      try {
        await pool.query(
          `UPDATE ingredients SET type = $1 WHERE id = $2`,
          [newType, extraIng.id]
        );
        updatedCount++;
      } catch (error: any) {
        console.error(`❌ Failed to update ${extraIng.name_de}: ${error.message}`);
        skippedCount++;
      }
    }

    console.log("\n✅ Migration completed!");
    console.log(`   Total updated: ${updatedCount} ingredients`);
    console.log(`   - Matched by name: ${matchedByName}`);
    console.log(`   - Inferred from keywords: ${inferredFromKeywords}`);
    console.log(`   - Defaulted to extra_fresh: ${defaultedToFresh}`);
    if (skippedCount > 0) {
      console.log(`   Skipped: ${skippedCount} ingredients (errors)`);
    }

    if (needsReview.length > 0) {
      console.log("\n⚠️  WARNING: The following ingredients were defaulted to 'extra_fresh':");
      console.log("⚠️  Please manually verify these in the admin panel:");
      needsReview.forEach(item => {
        console.log(`   - ${item.name} → ${item.type}`);
        console.log(`     Reason: ${item.reason}`);
      });
      console.log("\n📝 To verify, go to Admin Panel → Zutaten → Filter by 'Extra Frische'");
      console.log("   and check if all items belong to this category.\n");
    }

    // Verify the fix
    const verifyResult = await pool.query(`
      SELECT COUNT(*) as count FROM ingredients WHERE type = 'extra'
    `);

    const remaining = parseInt(verifyResult.rows[0].count);
    if (remaining === 0) {
      console.log("\n✅ All 'extra' type ingredients have been fixed!");
    } else {
      console.log(`\n⚠️  Warning: ${remaining} ingredients with type 'extra' still remain.`);
    }
    
  } catch (error: any) {
    console.error("❌ Error fixing extra ingredients:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }

  process.exit(0);
}

fixExtraIngredients();
