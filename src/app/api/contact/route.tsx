import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface Contact {
  id: number;
  name: string;
  link?: string | null;
  icon?: string | null;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET() {
  try {
    const contacts = await query({
      query: "SELECT id, name, link, icon FROM contact ORDER BY id ASC",
      values: [],
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, link, icon } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const result: any = await query({
      query: "INSERT INTO contact (name, link, icon) VALUES (?, ?, ?)",
      values: [name, link || null, icon || null],
    });

    if (result.affectedRows === 1 && result.insertId) {
      const newContact: Contact = {
        id: result.insertId,
        name,
        link,
        icon,
      };
      return NextResponse.json(newContact, { status: 201 });
    } else {
      return NextResponse.json({ error: "Failed to create contact item" }, { status: 500 });
    }
  } catch (error) {
    console.error("Failed to create contact:", error);
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }
}
