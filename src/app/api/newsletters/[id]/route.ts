import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db'; // Assuming db.tsx exports query
import { writeFile, mkdir, unlink } from 'fs/promises'; // Added unlink and mkdir
import path from 'path';

interface Params {
   id: string;
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
   try {
      const { id } = params;
      const newsletters = await query({ query: 'SELECT * FROM newsletter WHERE id = ?', values: [id] });
      if ((newsletters as any[]).length === 0) {
         return NextResponse.json({ message: 'Newsletter not found' }, { status: 404 });
      }
      return NextResponse.json((newsletters as any[])[0]);
   } catch (error) {
      console.error(`Error fetching newsletter ${params.id}:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return NextResponse.json({ message: 'Error fetching newsletter', error: errorMessage }, { status: 500 });
   }
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
   try {
      const { id } = params;
      const formData = await request.formData();
      const title = formData.get('title') as string | null;
      let content = formData.get('content') as string | null;
      const imageFile = formData.get('image') as File | null;
      const removeCurrentImage = formData.get('removeCurrentImage') === 'true';

      if (!title && !content && !imageFile && !removeCurrentImage) {
         return NextResponse.json({ message: 'Nothing to update. Title, content, image, or removeCurrentImage is required.' }, { status: 400 });
      }

      // Fetch existing newsletter to get current image_path if needed
      const existingNewsletterResult = await query({ query: 'SELECT content, image_path FROM newsletter WHERE id = ?', values: [id] });
      if ((existingNewsletterResult as any[]).length === 0) {
         return NextResponse.json({ message: 'Newsletter not found' }, { status: 404 });
      }
      const existingNewsletter = (existingNewsletterResult as any[])[0];
      const currentImagePath = existingNewsletter.image_path; // Changed to const
      let newImagePath: string | null = currentImagePath; // Initialize with current path

      // Handle image upload/replacement
      if (imageFile) {
         const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'newsletter_images');
         await mkdir(uploadsDir, { recursive: true });
         const uniqueFilename = `${Date.now()}-${imageFile.name}`;
         newImagePath = `/uploads/newsletter_images/${uniqueFilename}`;
         const filePath = path.join(uploadsDir, uniqueFilename);
         const buffer = Buffer.from(await imageFile.arrayBuffer());
         await writeFile(filePath, buffer);

         // If there was an old image and it's different from the new one, delete it
         if (currentImagePath && currentImagePath !== newImagePath) {
            try {
               const oldFilePath = path.join(process.cwd(), 'public', currentImagePath);
               await unlink(oldFilePath);
            } catch (e) {
               console.warn(`Failed to delete old image ${currentImagePath}:`, (e as Error).message);
            }
         }
      } else if (removeCurrentImage && currentImagePath) {
         // Handle explicit image removal
         try {
            const oldFilePath = path.join(process.cwd(), 'public', currentImagePath);
            await unlink(oldFilePath);
            newImagePath = null;
         } catch (e) {
            console.warn(`Failed to delete image ${currentImagePath}:`, (e as Error).message);
         }
      }

      // Update content with new image path if a new image was uploaded or if the image was removed
      if (content && (imageFile || (removeCurrentImage && newImagePath === null))) {
         // If a new image was uploaded, replace any existing newsletter image tag or placeholder
         // If image was removed, remove the image tag
         const imgTagRegex = /<img[^>]*src="(\/uploads\/newsletter_images\/[^"]*|blob:[^"]*)"[^>]*data-newsletter-image-placeholder="true"[^>]*>/i;
         const generalImgTagRegex = /<img[^>]*src="(\/uploads\/newsletter_images\/[^"]*)"[^>]*>/i;

         if (newImagePath) { // New image uploaded or existing one kept (if no new file but not removed)
            if (imgTagRegex.test(content)) {
               content = content.replace(imgTagRegex, `<img src="${newImagePath}" alt="Newsletter Image" data-newsletter-image-placeholder="true">`);
            } else if (generalImgTagRegex.test(content)) {
               content = content.replace(generalImgTagRegex, `<img src="${newImagePath}" alt="Newsletter Image">`);
            } else if (content.includes('<img data-newsletter-image-placeholder="true"')) { // Placeholder without src
               content = content.replace(/<img[^>]*data-newsletter-image-placeholder="true"[^>]*>/i, `<img src="${newImagePath}" alt="Newsletter Image" data-newsletter-image-placeholder="true">`);
            } else if (imageFile) { // Only add if a new file was explicitly uploaded and no placeholder/image was found
               content += `<br><img src="${newImagePath}" alt="Newsletter Image" data-newsletter-image-placeholder="true">`;
            }
         } else { // Image was removed
            content = content.replace(imgTagRegex, '');
            content = content.replace(generalImgTagRegex, '');
         }
      } else if (content && newImagePath && !imageFile && !removeCurrentImage && existingNewsletter.content !== content) {
         // Content changed, but image file not touched. Ensure existing image path is correctly in content.
         // This handles cases where user might manually remove/alter the img tag.
         const generalImgTagRegex = /<img[^>]*src="(\/uploads\/newsletter_images\/[^"]*)"[^>]*>/i;
         if (!generalImgTagRegex.test(content) && currentImagePath) {
            // If the image tag is missing but an image path exists, re-add it.
            // This might be too aggressive, depends on desired behavior.
            // For now, let's assume if they remove the tag, it's intentional unless a new image is uploaded.
         } else if (generalImgTagRegex.test(content) && currentImagePath) {
            // Ensure the src is the current one if it exists
            content = content.replace(generalImgTagRegex, `<img src="${currentImagePath}" alt="Newsletter Image">`);
         }
      }


      let queryString = 'UPDATE newsletter SET ';
      const queryParams: (string | number | null)[] = [];
      const setClauses: string[] = [];

      if (title) {
         setClauses.push('title = ?');
         queryParams.push(title);
      }
      if (content) {
         setClauses.push('content = ?');
         queryParams.push(content);
      }
      // Always update image_path, even if it's to null or the same value, to reflect changes
      setClauses.push('image_path = ?');
      queryParams.push(newImagePath);

      if (setClauses.length === 0) {
         return NextResponse.json({ message: 'No changes to apply.', id }, { status: 200 });
      }

      queryString += setClauses.join(', ');
      queryString += ', updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      queryParams.push(id);

      const result = await query({ query: queryString, values: queryParams });
      if ((result as any).affectedRows === 0 && (result as any).changedRows === 0) { // changedRows for SQLite
         // Check if it was due to no actual data change or not found
         const checkExists = await query({ query: 'SELECT id FROM newsletter WHERE id = ?', values: [id] });
         if ((checkExists as any[]).length === 0) {
            return NextResponse.json({ message: 'Newsletter not found' }, { status: 404 });
         }
         return NextResponse.json({ message: 'No effective changes made to the newsletter.', id }, { status: 200 });
      }
      return NextResponse.json({ message: 'Newsletter updated successfully', id, image_path: newImagePath });
   } catch (error) {
      console.error(`Error updating newsletter ${params.id}:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return NextResponse.json({ message: 'Error updating newsletter', error: errorMessage }, { status: 500 });
   }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
   try {
      const { id } = params;
      const result = await query({ query: 'DELETE FROM newsletter WHERE id = ?', values: [id] });
      if ((result as any).affectedRows === 0) {
         return NextResponse.json({ message: 'Newsletter not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Newsletter deleted successfully' });
   } catch (error) {
      console.error(`Error deleting newsletter ${params.id}:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return NextResponse.json({ message: 'Error deleting newsletter', error: errorMessage }, { status: 500 });
   }
}
