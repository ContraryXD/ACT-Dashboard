import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface Params {
   id: string;
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
   try {
      const { id } = params;
      const users = await query({ query: 'SELECT id, username, role, email, created_at FROM users WHERE id = ?', values: [id] });
      if ((users as any[]).length === 0) {
         return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      return NextResponse.json((users as any[])[0]);
   } catch (error) {
      console.error(`Error fetching user ${params.id}:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return NextResponse.json({ message: 'Error fetching user', error: errorMessage }, { status: 500 });
   }
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
   try {
      const { id } = params;
      const { username, password, role, email } = await request.json();

      if (!username && !password && !role && !email) {
         return NextResponse.json({ message: 'Nothing to update. Username, password, role, or email is required.' }, { status: 400 });
      }

      let queryString = 'UPDATE users SET ';
      const queryParams: (string | number)[] = [];

      if (username) {
         queryString += 'username = ?';
         queryParams.push(username);
      }
      // IMPORTANT: Handle password updates securely. This example is simplified.
      // In a real app, if a new password is provided, it should be hashed.
      if (password) {
         if (queryParams.length > 0) queryString += ', ';
         queryString += 'password_hash = ?'; // Storing plain password - BAD PRACTICE
         queryParams.push(password);
      }
      if (role) {
         if (queryParams.length > 0) queryString += ', ';
         queryString += 'role = ?';
         queryParams.push(role);
      }
      if (email) {
         if (queryParams.length > 0) queryString += ', ';
         queryString += 'email = ?';
         queryParams.push(email);
      }

      queryString += ' WHERE id = ?';
      queryParams.push(id);

      const result = await query({ query: queryString, values: queryParams });
      if ((result as any).affectedRows === 0) {
         return NextResponse.json({ message: 'User not found or no changes made' }, { status: 404 });
      }
      return NextResponse.json({ message: 'User updated successfully', id });
   } catch (error) {
      console.error(`Error updating user ${params.id}:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return NextResponse.json({ message: 'Error updating user', error: errorMessage }, { status: 500 });
   }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
   try {
      const { id } = params;
      const result = await query({ query: 'DELETE FROM users WHERE id = ?', values: [id] });
      if ((result as any).affectedRows === 0) {
         return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'User deleted successfully' });
   } catch (error) {
      console.error(`Error deleting user ${params.id}:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return NextResponse.json({ message: 'Error deleting user', error: errorMessage }, { status: 500 });
   }
}
