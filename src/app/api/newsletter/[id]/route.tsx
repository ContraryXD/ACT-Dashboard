import { NextResponse } from "next/server";
import { query } from "@/lib/db"; // Assuming this is your DB query function

interface RequestContext {
   params: {
      id: string;
   };
}

export async function OPTIONS() {
   return new NextResponse(null, {
      status: 204, // No Content
      headers: {
         "Access-Control-Allow-Origin": "*", // Or your specific origin
         "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
         "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
   });
}

export async function GET(request: Request, { params }: RequestContext) {
   const id = parseInt(params.id, 10);
   const result = await query("SELECT * FROM your_table WHERE id = ?", [id]);
   return NextResponse.json(result);
}

export async function PUT(request: Request, { params }: RequestContext) {
   const id = parseInt(params.id, 10);
   const body = await request.json();
   const result = await query("UPDATE your_table SET column_name = ? WHERE id = ?", [body.column_value, id]);
   return NextResponse.json(result);
}

export async function DELETE(request: Request, { params }: RequestContext) {
   const id = parseInt(params.id, 10);
   const result = await query("DELETE FROM your_table WHERE id = ?", [id]);
   return NextResponse.json(result);
}
