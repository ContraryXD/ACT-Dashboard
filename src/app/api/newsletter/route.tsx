import { NextResponse } from "next/server";
import { query } from "@/lib/db"; // Adjust path if your db.ts is elsewhere

export interface NewsletterItem {
   id: number;
   title: string;
   content: string; // HTML content
   created_at: string; // Or Date
   updated_at: string; // Or Date
}

export async function OPTIONS() {
   return new NextResponse(null, { status: 204 });
}

export async function GET() {
   try {
      const newsletterItems = await query({
         query: "SELECT id, title, content, created_at, updated_at FROM newsletter ORDER BY created_at DESC",
         values: []
      });
      return NextResponse.json(newsletterItems);
   } catch (error) {
      console.error("API GET Error:", error);
      return NextResponse.json({ error: "Failed to fetch newsletter items from the database." }, { status: 500 });
   }
}

export async function POST(request: Request) {
   try {
      const { title, content } = await request.json();

      if (!title || !content) {
         return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
      }

      const result: any = await query({
         query: "INSERT INTO newsletter (title, content) VALUES (?, ?)",
         values: [title, content]
      });

      if (result.affectedRows === 1 && result.insertId) {
         const newItem: NewsletterItem = {
            id: result.insertId,
            title,
            content,
            created_at: new Date().toISOString(), // Approximate, DB will have precise value
            updated_at: new Date().toISOString() // Approximate
         };
         return NextResponse.json(newItem, { status: 201 });
      } else {
         throw new Error("Failed to insert newsletter item into database.");
      }
   } catch (error) {
      console.error("API POST Error:", error);
      // Check if error is due to parsing or other issues
      if (error instanceof SyntaxError) {
         return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
      }
      return NextResponse.json({ error: "Failed to create newsletter item." }, { status: 500 });
   }
}
