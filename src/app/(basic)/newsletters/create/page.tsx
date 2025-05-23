// src/app/(basic)/newsletters/create/page.tsx
"use client";

import { useState, useEffect } from "react"; // Added useEffect
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateNewsletterPage() {
   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");
   const [image, setImage] = useState<File | null>(null);
   const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); // Added for blob URL
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const router = useRouter();

   useEffect(() => {
      // Cleanup function to revoke the object URL
      return () => {
         if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
         }
      };
   }, [imagePreviewUrl]);

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;

      // Revoke previous URL if it exists
      if (imagePreviewUrl) {
         URL.revokeObjectURL(imagePreviewUrl);
      }

      setImage(file);

      if (file) {
         const newObjectUrl = URL.createObjectURL(file);
         setImagePreviewUrl(newObjectUrl);
         // Added data-newsletter-image-placeholder for server-side replacement
         // Escaped backticks in the template literal for the style attribute
         const imageTag = `\n<img src="${newObjectUrl}" alt="${file.name}" data-newsletter-image-placeholder="true" style="max-width: 100%; height: auto; max-height: 200px; display: block; margin-top: 10px; margin-bottom: 10px;" />`;
         setContent((prevContent) => prevContent + imageTag);
      } else {
         setImagePreviewUrl(null);
         // Note: This does not automatically remove the img tag from content if the user deselects.
         // User would need to manually delete it from the textarea.
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content); // Content now includes the img tag with blob src
      if (image) {
         formData.append("image", image); // This is the actual file for upload
      }

      try {
         const response = await fetch("/api/newsletters", {
            method: "POST",
            body: formData
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create newsletter");
         }

         // const result = await response.json(); // Keep if you need id or other data from response
         // The setContent call here is removed as the image tag is already in the content.
         // The server will handle replacing the blob: url with the final path.

         router.push("/newsletters");
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
         <h1 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px" }}>Create Newsletter</h1>
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
               <label htmlFor="image" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Image (Optional - will be added to content):
               </label>
               <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleFileChange} // Updated to use new handler
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
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px"
               }}>
               {isSubmitting ? "Submitting..." : "Create Newsletter"}
            </button>
         </form>
      </div>
   );
}
