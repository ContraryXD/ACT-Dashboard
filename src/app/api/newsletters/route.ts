import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db'; // Assuming db.tsx exports query
import { writeFile, mkdir } from 'fs/promises'; // Import mkdir
import path from 'path';

export async function GET() {
   try {
      const newsletters = await query({ query: 'SELECT * FROM newsletter ORDER BY created_at DESC' });
      return NextResponse.json(newsletters);
   } catch (error) {
      console.error('Error fetching newsletters:', error);
      // Ensure error is a serializable object
      const errorMessage = error instanceof Error ? error.message : String(error);
      return NextResponse.json({ message: 'Error fetching newsletters', error: errorMessage }, { status: 500 });
   }
}

export async function POST(request: NextRequest) {
   try {
      const formData = await request.formData();
      const title = formData.get('title') as string;
      let content = formData.get('content') as string; // Made content mutable
      const imageFile = formData.get('image') as File | null;

      if (!title || !content) {
         return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
      }

      let image_path: string | null = null;
      if (imageFile) {
         const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'newsletter_images');
         // Ensure directory exists (create if not)
         try {
            await mkdir(uploadsDir, { recursive: true }); // Use imported mkdir
         } catch (mkdirError) {
            // ignore if directory already exists, otherwise log
            if ((mkdirError as NodeJS.ErrnoException).code !== 'EEXIST') {
               console.warn('Could not create upload directory:', mkdirError);
            }
         }
         const uniqueFilename = `${Date.now()}-${imageFile.name}`;
         image_path = `/uploads/newsletter_images/${uniqueFilename}`; // Public path
         const filePath = path.join(uploadsDir, uniqueFilename); // Filesystem path
         const buffer = Buffer.from(await imageFile.arrayBuffer());
         await writeFile(filePath, buffer);

         // Replace placeholder image src in content
         if (content && image_path) {
            // Regex to find <img ... src="blob:..." data-newsletter-image-placeholder="true" ... >
            // and replace its src attribute.
            const imgTagRegex = /(<img[^>]*data-newsletter-image-placeholder="true"[^>]*src=)("blob:[^"]*")([^>]*>)/i;
            if (imgTagRegex.test(content)) {
               content = content.replace(imgTagRegex, `$1"${image_path}"$3`);
            }
         }
      }

      const result = await query({
         query: 'INSERT INTO newsletter (title, content, image_path) VALUES (?, ?, ?)',
         values: [title, content, image_path],
      });
      return NextResponse.json({ message: 'Newsletter created successfully', id: (result as any).insertId, title, content, image_path }, { status: 201 });
   } catch (error) {
      console.error('Error creating newsletter:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return NextResponse.json({ message: 'Error creating newsletter', error: errorMessage }, { status: 500 });
   }
}
