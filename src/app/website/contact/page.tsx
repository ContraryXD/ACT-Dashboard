"use client";

import React, { useState, useEffect, FormEvent } from "react";

interface ContactItem {
  id: number;
  name: string;
  link?: string | null;
  icon?: string | null;
}

export default function ContactPage() {
  const [items, setItems] = useState<ContactItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states for adding
  const [newName, setNewName] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newIcon, setNewIcon] = useState("");

  // States for editing
  const [editingItem, setEditingItem] = useState<ContactItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editIcon, setEditIcon] = useState("");

  const API_URL = "/api/contact";

  // Fetch items
  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch contact items");
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

  // Handle Add Item
  const handleAddItem = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, link: newLink, icon: newIcon }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add contact item");
      }
      setNewName("");
      setNewLink("");
      setNewIcon("");
      fetchItems(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Delete Item
  const handleDeleteItem = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete contact item");
      }
      fetchItems(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Start Edit
  const handleStartEdit = (item: ContactItem) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditLink(item.link || "");
    setEditIcon(item.icon || "");
  };

  // Handle Update Item
  const handleUpdateItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, link: editLink, icon: editIcon }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update contact item");
      }
      setEditingItem(null);
      fetchItems(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 dark:text-white">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Manage Contact Information</h1>

      {error && <p className="mb-4 text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300 p-3 rounded-md">Error: {error}</p>}

      {/* Add/Edit Form Section */}
      <div className="mb-8 p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{editingItem ? "Edit Contact Item" : "Add New Contact Item"}</h2>
        <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name / Display Text <span className="text-red-500">*</span>
            </label>
            <input type="text" id="name" value={editingItem ? editName : newName} onChange={(e) => (editingItem ? setEditName(e.target.value) : setNewName(e.target.value))} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Link (e.g., mailto:email@example.com, tel:12345, https://...)
            </label>
            <input type="text" id="link" value={editingItem ? editLink : newLink} onChange={(e) => (editingItem ? setEditLink(e.target.value) : setNewLink(e.target.value))} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Icon (e.g., FontAwesome class like 'faEnvelope', or path to icon)
            </label>
            <input type="text" id="icon" value={editingItem ? editIcon : newIcon} onChange={(e) => (editingItem ? setEditIcon(e.target.value) : setNewIcon(e.target.value))} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          <div className="flex items-center space-x-3">
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {isLoading ? "Saving..." : editingItem ? "Update Item" : "Add Item"}
            </button>
            {editingItem && (
              <button type="button" onClick={() => setEditingItem(null)} disabled={isLoading} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-md shadow-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Display Items Section */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Current Contact Items</h2>
      {isLoading && items.length === 0 && <p className="dark:text-white">Loading items...</p>}
      {!isLoading && items.length === 0 && !error ? (
        <p className="text-gray-600 dark:text-gray-400">No contact items found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 shadow border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Link
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Icon
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.link || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.icon || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button onClick={() => handleStartEdit(item)} disabled={isLoading} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 disabled:opacity-50">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteItem(item.id)} disabled={isLoading} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 disabled:opacity-50">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
