import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// Define the Contact type based on your table structure
interface Contact {
  id?: number;
  name: string;
  link?: string | null;
  icon?: string | null;
}

// GET all contacts
export async function GET() {
  try {
    const contacts = await query<Contact[]>("SELECT * FROM contact ORDER BY id ASC");
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Failed to fetch contacts:", error); // <--- CHECK THIS LOG
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

// POST a new contact
export async function POST(req: NextRequest) {
  try {
    const { name, link, icon } = (await req.json()) as Omit<Contact, "id">;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const result = await query<any>("INSERT INTO contact (name, link, icon) VALUES (?, ?, ?)", [name, link || null, icon || null]);

    if (result.affectedRows > 0) {
      const newContactId = result.insertId;
      const newContact: Contact = { id: newContactId, name, link, icon };
      return NextResponse.json(newContact, { status: 201 });
    } else {
      return NextResponse.json({ error: "Failed to create contact item" }, { status: 500 });
    }
  } catch (error) {
    console.error("Failed to create contact:", error);
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }
}
