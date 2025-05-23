// src/app/(basic)/newsletters/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Newsletter {
   id: number;
   title: string;
   content: string;
   created_at: string;
   updated_at: string;
}

export default function NewslettersPage() {
   const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      async function fetchNewsletters() {
         try {
            setLoading(true);
            setError(null);
            const response = await fetch("/api/newsletters");
            if (!response.ok) {
               const errData = await response.json();
               throw new Error(errData.message || `Failed to fetch newsletters: ${response.statusText}`);
            }
            const data = await response.json();
            setNewsletters(data);
         } catch (err: any) {
            setError(err.message);
         } finally {
            setLoading(false);
         }
      }
      fetchNewsletters();
   }, []);

   const handleDelete = async (id: number) => {
      if (confirm("Are you sure you want to delete this newsletter?")) {
         try {
            setError(null);
            const response = await fetch(`/api/newsletters/${id}`, { method: "DELETE" });
            if (!response.ok) {
               const errorData = await response.json();
               throw new Error(errorData.message || "Failed to delete newsletter");
            }
            setNewsletters(newsletters.filter((n) => n.id !== id));
         } catch (err: any) {
            setError(err.message);
            alert(`Error: ${err.message}`);
         }
      }
   };

   if (loading) return <p>Loading newsletters...</p>;

   return (
      <div style={{ padding: "20px" }}>
         <h1>Newsletters</h1>
         {error && (
            <p style={{ color: "red", border: "1px solid red", padding: "10px", marginBottom: "10px" }}>
               Error: {error}
            </p>
         )}
         <Link
            href="/newsletters/create"
            style={{
               marginBottom: "20px",
               display: "inline-block",
               padding: "10px 15px",
               backgroundColor: "#007bff",
               color: "white",
               textDecoration: "none",
               borderRadius: "5px"
            }}>
            Create New Newsletter
         </Link>
         {newsletters.length === 0 && !loading ? (
            <p>No newsletters found.</p>
         ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
               {newsletters.map((newsletter) => (
                  <li
                     key={newsletter.id}
                     style={{
                        border: "1px solid #ddd",
                        marginBottom: "10px",
                        padding: "15px",
                        borderRadius: "5px",
                        backgroundColor: "#f9f9f9"
                     }}>
                     <h2>{newsletter.title}</h2>
                     <div
                        style={{
                           maxHeight: "100px",
                           overflowY: "auto",
                           marginBottom: "10px",
                           padding: "5px",
                           border: "1px solid #eee"
                        }}
                        dangerouslySetInnerHTML={{ __html: newsletter.content }}
                     />
                     <p>
                        <small>Created: {new Date(newsletter.created_at).toLocaleString()}</small>
                     </p>
                     <p>
                        <small>Updated: {new Date(newsletter.updated_at).toLocaleString()}</small>
                     </p>
                     <Link
                        href={`/newsletters/${newsletter.id}/edit`}
                        style={{ marginRight: "10px", color: "#28a745", textDecoration: "none" }}>
                        Edit
                     </Link>
                     <button
                        onClick={() => handleDelete(newsletter.id)}
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
