import { getDb } from "./db";
import { galleryImages } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";

async function importGalleryImages() {
  try {
    const db = await getDb();
    const imagesDir = path.join(process.cwd(), "public", "images");
    
    const files = fs.readdirSync(imagesDir);
    
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp';
    }).filter(file => {
      const lowerFile = file.toLowerCase();
      return !lowerFile.includes('categories') && 
             !lowerFile.includes('drinks') && 
             !lowerFile.includes('acai') &&
             !lowerFile.includes('falafel') &&
             !lowerFile.includes('garnelen') &&
             !lowerFile.includes('haehnchen') &&
             !lowerFile.includes('lachs') &&
             !lowerFile.includes('thunfisch') &&
             !lowerFile.includes('tofu') &&
             !lowerFile.includes('mittags') &&
             !lowerFile.includes('vitamins') &&
             !lowerFile.includes('wrap') &&
             !lowerFile.includes('salat') &&
             !lowerFile.includes('kokos') &&
             !lowerFile.includes('mandeln') &&
             !lowerFile.includes('wakame') &&
             !lowerFile.includes('fruehlingsrollen');
    });

    console.log(`📸 Found ${imageFiles.length} gallery images to import`);

    const existing = await db.select().from(galleryImages);
    const existingUrls = new Set(existing.map(img => img.url));

    let imported = 0;
    for (const file of imageFiles) {
      const url = `/media/${file}`;
      
      if (!existingUrls.has(url)) {
        await db.insert(galleryImages).values({
          url,
          filename: file,
        });
        console.log(`✅ Imported: ${file}`);
        imported++;
      } else {
        console.log(`⏭️  Skipped (already exists): ${file}`);
      }
    }

    console.log(`\n🎉 Import complete! Added ${imported} new images to gallery.`);
    console.log(`📊 Total gallery images: ${existing.length + imported}`);
    
  } catch (error) {
    console.error("❌ Error importing gallery images:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

importGalleryImages();
