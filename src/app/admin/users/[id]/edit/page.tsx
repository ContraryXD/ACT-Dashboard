// src/app/admin/users/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface User {
   id: number;
   username: string;
   email: string | null;
   role: "admin" | "advanced" | "basic";
}

export default function EditUserPage() {
   const router = useRouter();
   const params = useParams();
   const id = params?.id as string;

   const [username, setUsername] = useState("");
   const [email, setEmail] = useState("");
   const [role, setRole] = useState<"admin" | "advanced" | "basic">("basic");
   const [newPassword, setNewPassword] = useState(""); // For changing password

   const [isLoading, setIsLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [fetchError, setFetchError] = useState<string | null>(null);

   useEffect(() => {
      if (id) {
         async function fetchUser() {
            setIsLoading(true);
            setFetchError(null);
            try {
               const response = await fetch(`/api/users/${id}`);
               if (!response.ok) {
                  const errData = await response.json();
                  throw new Error(errData.message || "Failed to fetch user data");
               }
               const data: User = await response.json();
               setUsername(data.username);
               setEmail(data.email || "");
               setRole(data.role);
            } catch (err: any) {
               setFetchError(err.message);
            } finally {
               setIsLoading(false);
            }
         }
         fetchUser();
      }
   }, [id]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      if (newPassword && newPassword.length < 6) {
         setError("New password must be at least 6 characters long.");
         setIsSubmitting(false);
         return;
      }

      const payload: any = { username, email, role };
      if (newPassword) {
         payload.password = newPassword; // Only include password if it's being changed
      }

      try {
         const response = await fetch(`/api/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update user");
         }
         router.push("/admin/users");
      } catch (err: any) {
         setError(err.message);
      } finally {
         setIsSubmitting(false);
      }
   };

   if (isLoading) return <p>Loading user data...</p>;
   if (fetchError)
      return <p style={{ color: "red", border: "1px solid red", padding: "10px" }}>Error loading data: {fetchError}</p>;

   return (
      <div
         style={{
            padding: "20px",
            maxWidth: "600px",
            margin: "auto",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#fdfdfd"
         }}>
         <Link
            href="/admin/users"
            style={{ display: "inline-block", marginBottom: "20px", color: "#007bff", textDecoration: "none" }}>
            &larr; Back to Users
         </Link>
         <h1 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px" }}>Edit User (ID: {id})</h1>
         <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
               <label htmlFor="username" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Username:
               </label>
               <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{
                     width: "100%",
                     padding: "10px",
                     boxSizing: "border-box",
                     border: "1px solid #ccc",
                     borderRadius: "4px"
                  }}
               />
            </div>
            <div style={{ marginBottom: "15px" }}>
               <label htmlFor="email" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Email:
               </label>
               <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                     width: "100%",
                     padding: "10px",
                     boxSizing: "border-box",
                     border: "1px solid #ccc",
                     borderRadius: "4px"
                  }}
               />
            </div>
            <div style={{ marginBottom: "15px" }}>
               <label htmlFor="newPassword" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  New Password (leave blank to keep current):
               </label>
               <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  style={{
                     width: "100%",
                     padding: "10px",
                     boxSizing: "border-box",
                     border: "1px solid #ccc",
                     borderRadius: "4px"
                  }}
               />
            </div>
            <div style={{ marginBottom: "20px" }}>
               <label htmlFor="role" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Role:
               </label>
               <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as "admin" | "advanced" | "basic")}
                  required
                  style={{
                     width: "100%",
                     padding: "10px",
                     boxSizing: "border-box",
                     border: "1px solid #ccc",
                     borderRadius: "4px"
                  }}>
                  <option value="basic">Basic</option>
                  <option value="advanced">Advanced</option>
                  <option value="admin">Admin</option>
               </select>
            </div>
            {error && (
               <p style={{ color: "red", border: "1px solid red", padding: "10px", marginBottom: "10px" }}>
                  Error: {error}
               </p>
            )}
            <button
               type="submit"
               disabled={isSubmitting}
               style={{
                  padding: "10px 20px",
                  backgroundColor: "#ffc107",
                  color: "black",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px"
               }}>
               {isSubmitting ? "Updating User..." : "Update User"}
            </button>
         </form>
      </div>
   );
}
