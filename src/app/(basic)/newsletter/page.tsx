"use client";

import React, { useState, useEffect, FormEvent, useRef } from "react";

interface NewsletterItem {
   id: number;
   title: string;
   content: string;
   created_at: string; // Add created_at
   updated_at: string;
}

export default function NewsletterDisplayPage() {
   const [items, setItems] = useState<NewsletterItem[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isUploading, setIsUploading] = useState(false); // For image upload loading state
   const [error, setError] = useState<string | null>(null);

   // State for new item form
   const [newItemTitle, setNewItemTitle] = useState("");
   const [newItemContent, setNewItemContent] = useState("");

   // State for editing item
   const [editingItem, setEditingItem] = useState<NewsletterItem | null>(null);
   const [editItemTitle, setEditItemTitle] = useState("");
   const [editItemContent, setEditItemContent] = useState("");

   const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

   const fetchItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
         const response = await fetch("/api/newsletter");
         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to fetch newsletter items: ${response.statusText}`);
         }
         const data = await response.json();
         setItems(data);
      } catch (err: any) {
         setError(err.message);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchItems();
   }, []);

   const handleAddItem = async (e: FormEvent) => {
      e.preventDefault();
      if (!newItemTitle.trim() || !newItemContent.trim()) {
         alert("Title and Content are required.");
         return;
      }
      setError(null);
      setIsLoading(true); // Indicate loading for add/update
      try {
         const response = await fetch("/api/newsletter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newItemTitle, content: newItemContent })
         });
         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to add newsletter item");
         }
         setNewItemTitle("");
         setNewItemContent("");
         fetchItems();
      } catch (err: any) {
         setError(err.message);
      } finally {
         setIsLoading(false);
      }
   };

   const handleDeleteItem = async (id: number) => {
      if (!confirm("Are you sure you want to delete this newsletter post?")) return;
      setError(null);
      setIsLoading(true);
      try {
         const response = await fetch(`/api/newsletter/${id}`, { method: "DELETE" });
         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to delete newsletter item");
         }
         fetchItems();
      } catch (err: any) {
         setError(err.message);
      } finally {
         setIsLoading(false);
      }
   };

   const handleStartEdit = (item: NewsletterItem) => {
      setEditingItem(item);
      setEditItemTitle(item.title);
      setEditItemContent(item.content);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to form
   };

   const handleCancelEdit = () => {
      setEditingItem(null);
      setEditItemTitle("");
      setEditItemContent("");
   };

   const handleUpdateItem = async (e: FormEvent) => {
      e.preventDefault();
      if (!editingItem || !editItemTitle.trim() || !editItemContent.trim()) {
         alert("Title and Content are required for editing.");
         return;
      }
      setError(null);
      setIsLoading(true);
      try {
         const response = await fetch(`/api/newsletter/${editingItem.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: editItemTitle, content: editItemContent })
         });
         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update newsletter item");
         }
         setEditingItem(null);
         fetchItems();
      } catch (err: any) {
         setError(err.message);
      } finally {
         setIsLoading(false);
      }
   };

   const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", file);

      try {
         const response = await fetch("/api/upload-image", {
            method: "POST",
            body: formData
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Image upload failed");
         }

         const result = await response.json();
         if (result.success && result.filePath) {
            const imageUrl = result.filePath;
            const imageTag = `<img src="${imageUrl}" alt="${file.name}" style="max-width:100%;height:auto;margin:10px 0;" />`;

            if (editingItem) {
               setEditItemContent((prevContent) => prevContent + "\n" + imageTag);
            } else {
               setNewItemContent((prevContent) => prevContent + "\n" + imageTag);
            }
         }
      } catch (err: any) {
         setError(err.message);
         alert(`Image upload error: ${err.message}`);
      } finally {
         setIsUploading(false);
         if (fileInputRef.current) {
            fileInputRef.current.value = "";
         }
      }
   };

   if (isLoading && !items.length && !error) {
      return <div className="p-4 md:p-8 dark:text-white">Loading newsletter items...</div>;
   }

   return (
      <div className="p-4 md:p-8 dark:text-white">
         <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Newsletter Management</h1>

         {error && (
            <p className="text-red-500 bg-red-100 dark:bg-red-900 border border-red-500 p-3 rounded mb-4">
               Error: {error}
            </p>
         )}

         {/* Add/Edit Form Section */}
         <div className="mb-8 p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800">
            <h2 className="text-xl font-medium mb-4">
               {editingItem ? "Edit Newsletter Post" : "Add New Newsletter Post"}
            </h2>
            <form onSubmit={editingItem ? handleUpdateItem : handleAddItem}>
               <div className="mb-4">
                  <label htmlFor="itemTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                     Title:
                  </label>
                  <input
                     id="itemTitle"
                     type="text"
                     value={editingItem ? editItemTitle : newItemTitle}
                     onChange={(e) =>
                        editingItem ? setEditItemTitle(e.target.value) : setNewItemTitle(e.target.value)
                     }
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
                     required
                  />
               </div>
               <div className="mb-4">
                  <label htmlFor="itemContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                     Content (HTML allowed):
                  </label>
                  <textarea
                     id="itemContent"
                     value={editingItem ? editItemContent : newItemContent}
                     onChange={(e) =>
                        editingItem ? setEditItemContent(e.target.value) : setNewItemContent(e.target.value)
                     }
                     rows={10}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
                     required
                  />
                  <div className="mt-2 flex items-center">
                     <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        id="imageUploadInput"
                     />
                     <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 text-sm bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                        disabled={isUploading}>
                        {isUploading ? "Uploading..." : "Upload Image"}
                     </button>
                     <p className="ml-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        You can use HTML tags for formatting, e.g., &lt;p&gt;, &lt;strong&gt;. Images will be inserted
                        as &lt;img&gt; tags.
                     </p>
                  </div>
               </div>
               <div className="flex items-center">
                  <button
                     type="submit"
                     className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                     disabled={isLoading || isUploading}>
                     {isLoading && !isUploading ? "Saving..." : editingItem ? "Update Post" : "Add Post"}
                  </button>
                  {editingItem && (
                     <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="ml-3 px-4 py-2 bg-gray-300 text-gray-800 font-medium rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                        disabled={isUploading}>
                        Cancel Edit
                     </button>
                  )}
               </div>
            </form>
         </div>

         {/* Display Items Section */}
         <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Current Newsletter Posts</h2>
         {isLoading && items.length > 0 && <p className="dark:text-white">Refreshing list...</p>}
         {!isLoading && items.length === 0 && !error ? (
            <p className="text-gray-600 dark:text-gray-400">No newsletter posts found.</p>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {items.map((item) => (
                  <article
                     key={item.id} // Changed key from index to item.id
                     className="flex flex-col p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
                     <div className="flex justify-between items-start mb-2">
                        <div>
                           <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                        </div>
                        <div className="flex-shrink-0 space-x-2">
                           <button
                              onClick={() => handleStartEdit(item)}
                              className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                              disabled={isUploading}>
                              Edit
                           </button>
                           <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                              disabled={isUploading || isLoading}>
                              Delete
                           </button>
                        </div>
                     </div>
                     <div
                        className="prose dark:prose-invert max-w-none mt-2 flex-grow overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                     />
                     <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p>Created: {new Date(item.created_at).toLocaleString()}</p>
                        <p>Last Updated: {new Date(item.updated_at).toLocaleString()}</p>
                     </div>
                  </article>
               ))}
            </div>
         )}
      </div>
   );
}
