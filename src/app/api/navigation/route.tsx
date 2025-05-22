import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export interface NavigationItem {
  id: number;
  name: string;
  href: string;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET() {
  try {
    const navigationItems = await query({
      query: "SELECT id, name, href FROM navigation ORDER BY id ASC",
      values: [],
    });
    return NextResponse.json(navigationItems);
  } catch (error) {
    console.error("API GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch navigation items from the database." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, href } = await request.json();

    if (!name || !href) {
      return NextResponse.json({ error: "Name and href are required." }, { status: 400 });
    }

    const result: any = await query({
      query: "INSERT INTO navigation (name, href) VALUES (?, ?)",
      values: [name, href],
    });

    if (result.affectedRows === 1 && result.insertId) {
      const newItem: NavigationItem = {
        id: result.insertId,
        name,
        href,
      };
      return NextResponse.json(newItem, { status: 201 });
    } else {
      throw new Error("Failed to insert navigation item into database.");
    }
  } catch (error) {
    console.error("API POST Error:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create navigation item." }, { status: 500 });
  }
}
