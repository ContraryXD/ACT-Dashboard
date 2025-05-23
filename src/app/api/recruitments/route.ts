// src/app/api/recruitments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises'; // For creating directory if it doesn't exist

export async function GET() {
   try {
      const recruitments = await query({
         query: 'SELECT id, title, image_path, work_location, work_time, created_at FROM recruitments ORDER BY created_at DESC',
      });
      return NextResponse.json(recruitments);
   } catch (error) {
      console.error('Error fetching recruitments:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return NextResponse.json({ message: 'Error fetching recruitments', error: errorMessage }, { status: 500 });
   }
}

export async function POST(request: NextRequest) {
   try {
      const formData = await request.formData();
      const title = formData.get('title') as string;
      const job_description = formData.get('job_description') as string | null;
      const candidate_requirements = formData.get('candidate_requirements') as string | null;
      const benefits = formData.get('benefits') as string | null;
      const work_location = formData.get('work_location') as string | null;
      const work_time = formData.get('work_time') as string | null;
      const application_method = formData.get('application_method') as string | null;
      const contact_info = formData.get('contact_info') as string | null;
      const imageFile = formData.get('image') as File | null;

      if (!title) {
         return NextResponse.json({ message: 'Title is required' }, { status: 400 });
      }

      let image_path: string | null = null;
      let finalContent = job_description; // Assuming job_description might contain the image tag

      if (imageFile) {
         const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'recruitment_images');
         await mkdir(uploadsDir, { recursive: true }); // Ensure directory exists
         const uniqueFilename = `${Date.now()}-${imageFile.name.replace(/\s+/g, '_')}`; // Sanitize filename
         const relativeImagePath = `/uploads/recruitment_images/${uniqueFilename}`;
         const absoluteFilePath = path.join(uploadsDir, uniqueFilename);

         const buffer = Buffer.from(await imageFile.arrayBuffer());
         await writeFile(absoluteFilePath, buffer);
         image_path = relativeImagePath;

         // If job_description (or another field) contains a placeholder for the image
         if (finalContent && finalContent.includes('data-recruitment-image-placeholder="true"')) {
            // Regex to find the img tag with blob src and placeholder attribute
            const imgTagRegex = /<img[^>]*src="blob:[^"]*"[^>]*data-recruitment-image-placeholder="true"[^>]*>/;
            finalContent = finalContent.replace(imgTagRegex, `<img src="${image_path}" alt="${title || 'Recruitment Image'}" style="max-width: 100%; height: auto;">`);
         } else if (finalContent) { // Fallback: append if no placeholder
            finalContent += `\n<img src="${image_path}" alt="${title || 'Recruitment Image'}" style="max-width: 100%; height: auto;">`;
         } else { // If no content, create it with the image
            finalContent = `<img src="${image_path}" alt="${title || 'Recruitment Image'}" style="max-width: 100%; height: auto;">`;
         }
      }

      const sqlQuery = `
      INSERT INTO recruitments 
      (title, image_path, job_description, candidate_requirements, benefits, work_location, work_time, application_method, contact_info) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
      const values = [
         title,
         image_path,
         finalContent, // job_description now contains the updated image path if an image was uploaded
         candidate_requirements,
         benefits,
         work_location,
         work_time,
         application_method,
         contact_info
      ];

      const result = await query({ query: sqlQuery, values });
      const insertId = (result as any).insertId;

      return NextResponse.json({
         message: 'Recruitment created successfully',
         id: insertId,
         title,
         image_path,
         job_description: finalContent
      }, { status: 201 });

   } catch (error) {
      console.error('Error creating recruitment:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return NextResponse.json({ message: 'Error creating recruitment', error: errorMessage }, { status: 500 });
   }
}
