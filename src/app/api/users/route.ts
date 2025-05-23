import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
   try {
      const users = await query({ query: 'SELECT id, username, role, email, created_at FROM users' });
      return NextResponse.json(users);
   } catch (error) {
      console.error('Error fetching users:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return NextResponse.json({ message: 'Error fetching users', error: errorMessage }, { status: 500 });
   }
}

export async function POST(request: NextRequest) {
   try {
      const { username, password, role, email } = await request.json();
      if (!username || !password || !role) {
         return NextResponse.json({ message: 'Username, password, and role are required' }, { status: 400 });
      }
      // In a real application, hash the password before storing it
      // For simplicity, we are storing it as is, but this is NOT secure.
      const result = await query({
         query: 'INSERT INTO users (username, password_hash, role, email) VALUES (?, ?, ?, ?)',
         values: [username, password, role, email] // Storing plain password - BAD PRACTICE
      });
      return NextResponse.json({ message: 'User created successfully', id: (result as any).insertId }, { status: 201 });
   } catch (error) {
      console.error('Error creating user:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return NextResponse.json({ message: 'Error creating user', error: errorMessage }, { status: 500 });
   }
}
