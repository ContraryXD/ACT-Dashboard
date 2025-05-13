import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { stat } from "fs/promises";

// Helper function to ensure directory exists
async function ensureDirExists(dirPath: string) {
   try {
      await stat(dirPath);
   } catch (error: any) {
      if (error.code === "ENOENT") {
         await mkdir(dirPath, { recursive: true });
      } else {
         throw error;
      }
   }
}

export async function POST(request: NextRequest) {
   const formData = await request.formData();
   const file = formData.get("file") as File | null;

   if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
   }

   // Basic validation for image type (optional, but recommended)
   if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type. Only images are allowed." }, { status: 400 });
   }

   // Basic validation for file size (e.g., 5MB limit)
   const maxSize = 5 * 2048 * 2048; // 5MB
   if (file.size > maxSize) {
      return NextResponse.json(
         { error: `File size exceeds the limit of ${maxSize / (1024 * 1024)}MB.` },
         { status: 400 }
      );
   }

   const bytes = await file.arrayBuffer();
   const buffer = Buffer.from(bytes);

   // Create a unique filename to prevent overwriting
   const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
   const uploadDir = path.join(process.cwd(), "public", "uploads", "newsletter_images");
   const relativePath = `/uploads/newsletter_images/${filename}`;
   const absolutePath = path.join(uploadDir, filename);

   try {
      await ensureDirExists(uploadDir);
      await writeFile(absolutePath, buffer);
      console.log(`File uploaded to ${absolutePath}`);
      return NextResponse.json({ success: true, filePath: relativePath });
   } catch (error) {
      console.error("Error uploading file:", error);
      return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
   }
}
