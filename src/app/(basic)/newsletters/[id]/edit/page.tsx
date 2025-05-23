// src/app/(basic)/newsletters/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Newsletter {
   id: number;
   title: string;
   content: string;
}

export default function EditNewsletterPage() {
   const router = useRouter();
   const params = useParams();
   const id = params?.id as string;

   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [fetchError, setFetchError] = useState<string | null>(null);

   useEffect(() => {
      if (id) {
         async function fetchNewsletter() {
            setIsLoading(true);
            setFetchError(null);
            try {
               const response = await fetch(`/api/newsletters/${id}`);
               if (!response.ok) {
                  const errData = await response.json();
                  throw new Error(errData.message || "Failed to fetch newsletter data");
               }
               const data: Newsletter = await response.json();
               setTitle(data.title);
               setContent(data.content);
            } catch (err: any) {
               setFetchError(err.message);
            } finally {
               setIsLoading(false);
            }
         }
         fetchNewsletter();
      }
   }, [id]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      try {
         const response = await fetch(`/api/newsletters/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content })
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update newsletter");
         }
         router.push("/newsletters");
      } catch (err: any) {
         setError(err.message);
      } finally {
         setIsSubmitting(false);
      }
   };

   if (isLoading) return <p>Loading newsletter data...</p>;
   if (fetchError)
      return <p style={{ color: "red", border: "1px solid red", padding: "10px" }}>Error loading data: {fetchError}</p>;

   return (
      <div
         style={{
            padding: "20px",
            maxWidth: "700px",
            margin: "auto",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#fdfdfd"
         }}>
         <Link
            href="/newsletters"
            style={{ display: "inline-block", marginBottom: "20px", color: "#007bff", textDecoration: "none" }}>
            &larr; Back to Newsletters
         </Link>
         <h1 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px" }}>Edit Newsletter (ID: {id})</h1>
         <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
               <label htmlFor="title" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Title:
               </label>
               <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
               <label htmlFor="content" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Content (HTML allowed):
               </label>
               <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={15}
                  style={{
                     width: "100%",
                     padding: "10px",
                     boxSizing: "border-box",
                     border: "1px solid #ccc",
                     borderRadius: "4px",
                     minHeight: "200px"
                  }}
               />
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
               {isSubmitting ? "Updating..." : "Update Newsletter"}
            </button>
         </form>
      </div>
   );
}
