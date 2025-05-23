import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs"; // For password hashing

// Define the User interface based on your table structure
export interface User {
   id: number;
   username: string;
   password_hash?: string; // Password hash should not be sent to client in GET responses
   role: "admin" | "advanced" | "basic";
   email?: string | null;
   created_at?: string; // Or Date
}

// Interface for POST request, expecting a plain password
interface UserCreationRequest {
   username: string;
   password?: string; // Plain password for creation/update
   role: "admin" | "advanced" | "basic";
   email?: string | null;
}

export async function OPTIONS() {
   return new NextResponse(null, {
      status: 204,
      headers: {
         "Access-Control-Allow-Origin": "*", // Adjust as needed for security
         "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
         "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
   });
}

// GET all users (excluding password_hash)
export async function GET() {
   try {
      const users = await query<Omit<User, "password_hash">[]>({
         query: "SELECT id, username, role, email, created_at FROM users ORDER BY id ASC",
         values: []
      });
      return NextResponse.json(users);
   } catch (error) {
      console.error("Failed to fetch users:", error);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
   }
}

// POST a new user
export async function POST(req: NextRequest) {
   try {
      const { username, password, role, email } = (await req.json()) as UserCreationRequest;

      if (!username || !password || !role) {
         return NextResponse.json({ error: "Username, password, and role are required" }, { status: 400 });
      }

      // Securely hash the password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      const result = await query<any>({
         query: "INSERT INTO users (username, password_hash, role, email) VALUES (?, ?, ?, ?)",
         values: [username, password_hash, role, email || null]
      });

      if (result.affectedRows === 1 && result.insertId) {
         const newUser: Omit<User, "password_hash"> = {
            id: result.insertId,
            username,
            role,
            email,
            created_at: new Date().toISOString() // Approximate, DB will have precise value
         };
         return NextResponse.json(newUser, { status: 201 });
      } else {
         return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
      }
   } catch (error) {
      console.error("Failed to create user:", error);
      if (error instanceof SyntaxError) {
         return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
      }
      // Check for duplicate username or email if you have unique constraints
      // For example, if (error.code === 'ER_DUP_ENTRY') { ... }
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
   }
}
