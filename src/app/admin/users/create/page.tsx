// src/app/admin/users/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateUserPage() {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [email, setEmail] = useState("");
   const [role, setRole] = useState<"admin" | "advanced" | "basic">("basic");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      if (password.length < 6) {
         setError("Password must be at least 6 characters long.");
         setIsSubmitting(false);
         return;
      }

      try {
         const response = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, email, role })
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create user");
         }
         router.push("/admin/users");
      } catch (err: any) {
         setError(err.message);
      } finally {
         setIsSubmitting(false);
      }
   };

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
         <h1 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px" }}>Create New User</h1>
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
                  Email (optional):
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
               <label htmlFor="password" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Password:
               </label>
               <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px"
               }}>
               {isSubmitting ? "Creating User..." : "Create User"}
            </button>
         </form>
      </div>
   );
}
