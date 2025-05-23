// src/app/recruitments/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Recruitment {
   id: number;
   title: string;
   image_path: string | null;
   work_location: string | null;
   work_time: string | null;
   created_at: string;
}

export default function RecruitmentsPage() {
   const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      async function fetchRecruitments() {
         try {
            setLoading(true);
            setError(null);
            const response = await fetch("/api/recruitments");
            if (!response.ok) {
               const errData = await response.json();
               throw new Error(errData.message || `Failed to fetch recruitments: ${response.statusText}`);
            }
            const data = await response.json();
            setRecruitments(data);
         } catch (err: any) {
            setError(err.message);
         } finally {
            setLoading(false);
         }
      }
      fetchRecruitments();
   }, []);

   const handleDelete = async (id: number) => {
      if (confirm("Are you sure you want to delete this recruitment?")) {
         try {
            setError(null);
            const response = await fetch(`/api/recruitments/${id}`, { method: "DELETE" });
            if (!response.ok) {
               const errorData = await response.json();
               throw new Error(errorData.message || "Failed to delete recruitment");
            }
            setRecruitments(recruitments.filter((r) => r.id !== id));
         } catch (err: any) {
            setError(err.message);
            alert(`Error: ${err.message}`);
         }
      }
   };

   if (loading) return <p>Loading recruitments...</p>;

   return (
      <div style={{ padding: "20px" }}>
         <h1>Recruitment Postings</h1>
         {error && (
            <p style={{ color: "red", border: "1px solid red", padding: "10px", marginBottom: "10px" }}>
               Error: {error}
            </p>
         )}
         <Link
            href="/recruitments/create"
            style={{
               marginBottom: "20px",
               display: "inline-block",
               padding: "10px 15px",
               backgroundColor: "#007bff",
               color: "white",
               textDecoration: "none",
               borderRadius: "5px"
            }}>
            Create New Recruitment
         </Link>
         {recruitments.length === 0 && !loading ? (
            <p>No recruitment postings found.</p>
         ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
               {recruitments.map((recruitment) => (
                  <li
                     key={recruitment.id}
                     style={{
                        border: "1px solid #ddd",
                        marginBottom: "10px",
                        padding: "15px",
                        borderRadius: "5px",
                        backgroundColor: "#f9f9f9"
                     }}>
                     <h2>{recruitment.title}</h2>
                     {recruitment.image_path && (
                        <img
                           src={recruitment.image_path}
                           alt={recruitment.title}
                           style={{
                              maxWidth: "200px",
                              maxHeight: "150px",
                              marginBottom: "10px",
                              border: "1px solid #eee"
                           }}
                        />
                     )}
                     <p>
                        <strong>Location:</strong> {recruitment.work_location || "N/A"}
                     </p>
                     <p>
                        <strong>Work Time:</strong> {recruitment.work_time || "N/A"}
                     </p>
                     <p>
                        <small>Created: {new Date(recruitment.created_at).toLocaleString()}</small>
                     </p>
                     <Link
                        href={`/recruitments/${recruitment.id}/edit`}
                        style={{ marginRight: "10px", color: "#28a745", textDecoration: "none" }}>
                        Edit
                     </Link>
                     <button
                        onClick={() => handleDelete(recruitment.id)}
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
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}
