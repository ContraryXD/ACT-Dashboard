import { NextResponse } from "next/server";
import { query } from "@/lib/db"; // Adjust path if your db.ts is elsewhere

export interface NavigationItem {
   id: number;
   name: string;
   href: string;
}

export async function GET() {
   try {
      const navigationItems = await query({
         query: "SELECT id, name, href FROM navigation", // Table name from act.sql
         values: []
      });
      return NextResponse.json(navigationItems);
   } catch (error) {
      // The error is already logged in the db.ts utility
      // Return a generic error response to the client
      return NextResponse.json({ error: "Failed to fetch navigation items from the database." }, { status: 500 });
   }
}
