import { NextResponse } from "next/server";
import { query } from "@/lib/db"; // Adjust path if your db.ts is elsewhere
import { NewsletterItem } from "../route"; // Import the interface

interface RequestContext {
   params: {
      id: string;
   };
}

// GET a single newsletter item (optional, but good for fetching item to edit)
export async function GET(request: Request, { params }: RequestContext) {
   const id = parseInt(params.id, 10);
   if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format." }, { status: 400 });
   }

   try {
      const items: any = await query({
         query: "SELECT id, title, content, created_at, updated_at FROM newsletter WHERE id = ?",
         values: [id]
      });
      if (items.length > 0) {
         return NextResponse.json(items[0]);
      }
      return NextResponse.json({ error: "Newsletter item not found." }, { status: 404 });
   } catch (error) {
      console.error(`API GET /api/newsletter/${id} Error:`, error);
      return NextResponse.json({ error: "Failed to fetch newsletter item." }, { status: 500 });
   }
}

export async function PUT(request: Request, { params }: RequestContext) {
   const id = parseInt(params.id, 10);
   if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format." }, { status: 400 });
   }

   try {
      const { title, content } = await request.json();
      if (!title || !content) {
         return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
      }

      const result: any = await query({
         query: "UPDATE newsletter SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
         values: [title, content, id]
      });

      if (result.affectedRows === 1) {
         // Fetch the updated item to return it
         const updatedItems: any = await query({
            query: "SELECT id, title, content, created_at, updated_at FROM newsletter WHERE id = ?",
            values: [id]
         });
         if (updatedItems.length > 0) {
            return NextResponse.json(updatedItems[0]);
         }
      }
      return NextResponse.json({ error: "Newsletter item not found or no changes made." }, { status: 404 });
   } catch (error) {
      console.error(`API PUT /api/newsletter/${id} Error:`, error);
      if (error instanceof SyntaxError) {
         return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
      }
      return NextResponse.json({ error: "Failed to update newsletter item." }, { status: 500 });
   }
}

export async function DELETE(request: Request, { params }: RequestContext) {
   const id = parseInt(params.id, 10);
   if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format." }, { status: 400 });
   }

   try {
      const result: any = await query({
         query: "DELETE FROM newsletter WHERE id = ?",
         values: [id]
      });

      if (result.affectedRows === 1) {
         return NextResponse.json({ message: "Newsletter item deleted successfully." });
      }
      return NextResponse.json({ error: "Newsletter item not found." }, { status: 404 });
   } catch (error) {
      console.error(`API DELETE /api/newsletter/${id} Error:`, error);
      return NextResponse.json({ error: "Failed to delete newsletter item." }, { status: 500 });
   }
}
