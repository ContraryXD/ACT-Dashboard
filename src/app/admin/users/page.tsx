// src/app/admin/users/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
   id: number;
   username: string;
   role: "admin" | "advanced" | "basic";
   email: string | null;
   created_at: string;
}

export default function UsersPage() {
   const [users, setUsers] = useState<User[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      async function fetchUsers() {
         try {
            setLoading(true);
            setError(null);
            const response = await fetch("/api/users");
            if (!response.ok) {
               const errData = await response.json();
               throw new Error(errData.message || `Failed to fetch users: ${response.statusText}`);
            }
            const data = await response.json();
            setUsers(data);
         } catch (err: any) {
            setError(err.message);
         } finally {
            setLoading(false);
         }
      }
      fetchUsers();
   }, []);

   const handleDelete = async (id: number) => {
      if (confirm("Are you sure you want to delete this user?")) {
         try {
            setError(null);
            const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
            if (!response.ok) {
               const errorData = await response.json();
               throw new Error(errorData.message || "Failed to delete user");
            }
            setUsers(users.filter((u) => u.id !== id));
         } catch (err: any) {
            setError(err.message);
            alert(`Error: ${err.message}`);
         }
      }
   };

   if (loading) return <p>Loading users...</p>;

   return (
      <div style={{ padding: "20px" }}>
         <h1>Manage Users</h1>
         {error && (
            <p style={{ color: "red", border: "1px solid red", padding: "10px", marginBottom: "10px" }}>
               Error: {error}
            </p>
         )}
         <Link
            href="/admin/users/create"
            style={{
               marginBottom: "20px",
               display: "inline-block",
               padding: "10px 15px",
               backgroundColor: "#007bff",
               color: "white",
               textDecoration: "none",
               borderRadius: "5px"
            }}>
            Create New User
         </Link>
         {users.length === 0 && !loading ? (
            <p>No users found.</p>
         ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
               <thead>
                  <tr style={{ borderBottom: "2px solid #ddd", backgroundColor: "#f2f2f2" }}>
                     <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
                     <th style={{ padding: "12px", textAlign: "left" }}>Username</th>
                     <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
                     <th style={{ padding: "12px", textAlign: "left" }}>Role</th>
                     <th style={{ padding: "12px", textAlign: "left" }}>Created At</th>
                     <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {users.map((user) => (
                     <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "12px" }}>{user.id}</td>
                        <td style={{ padding: "12px" }}>{user.username}</td>
                        <td style={{ padding: "12px" }}>{user.email || "N/A"}</td>
                        <td style={{ padding: "12px" }}>{user.role}</td>
                        <td style={{ padding: "12px" }}>{new Date(user.created_at).toLocaleString()}</td>
                        <td style={{ padding: "12px" }}>
                           <Link
                              href={`/admin/users/${user.id}/edit`}
                              style={{ marginRight: "10px", color: "#28a745", textDecoration: "none" }}>
                              Edit
                           </Link>
                           <button
                              onClick={() => handleDelete(user.id)}
                              style={{
                                 color: "#dc3545",
                                 background: "none",
                                 border: "1px solid #dc3545",
                                 padding: "5px 10px",
                                 cursor: "pointer",
                                 borderRadius: "3px"
                              }}>
                              Delete
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         )}
      </div>
   );
}
