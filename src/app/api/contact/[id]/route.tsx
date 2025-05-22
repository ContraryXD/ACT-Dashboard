import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface Contact {
  id?: number;
  name: string;
  link?: string | null;
  icon?: string | null;
}

interface Params {
  id: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = params;
    const contactResults = await query<Contact[]>("SELECT * FROM contact WHERE id = ?", [id]);

    if (contactResults.length === 0) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json(contactResults[0]);
  } catch (error) {
    console.error(`Failed to fetch contact ${params.id}:`, error);
    return NextResponse.json({ error: `Failed to fetch contact ${params.id}` }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = params;
    const { name, link, icon } = (await req.json()) as Omit<Contact, "id">;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const result = await query<any>("UPDATE contact SET name = ?, link = ?, icon = ? WHERE id = ?", [name, link || null, icon || null, id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Contact not found or no changes made" }, { status: 404 });
    }
    const updatedContact: Contact = { id: parseInt(id, 10), name, link, icon };
    return NextResponse.json(updatedContact);
  } catch (error) {
    console.error(`Failed to update contact ${params.id}:`, error);
    return NextResponse.json({ error: `Failed to update contact ${params.id}` }, { status: 500 });
  }
}

// DELETE a contact by ID
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = params;
    const result = await query<any>("DELETE FROM contact WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Contact deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete contact ${params.id}:`, error);
    return NextResponse.json({ error: `Failed to delete contact ${params.id}` }, { status: 500 });
  }
}
