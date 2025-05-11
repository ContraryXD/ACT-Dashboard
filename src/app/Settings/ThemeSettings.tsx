"use client";

import React, { useState, useEffect } from "react";

export default function ThemeSettings() {
  // Initialize theme state to null to prevent rendering with a default
  // before the actual theme is loaded from localStorage or system prefs.
  const [theme, setTheme] = useState<string | null>(null);

  // Effect to load theme from localStorage/system preference and apply it
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    let determinedTheme: string;

    // Check if a valid theme is stored in localStorage
    if (storedTheme === "light" || storedTheme === "dark") {
      determinedTheme = storedTheme;
    } else {
      // If no valid theme is stored, check system preference
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      determinedTheme = prefersDark ? "dark" : "light";
      // Persist the determined (or default) theme to localStorage
      localStorage.setItem("theme", determinedTheme);
    }

    setTheme(determinedTheme);
    // Apply/remove 'dark' class on the <html> element
    document.documentElement.classList.toggle("dark", determinedTheme === "dark");
  }, []); // Empty dependency array means this runs once on mount

  const toggleTheme = () => {
    // Ensure theme is loaded before allowing toggle
    if (theme === null) return;

    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    // Apply/remove 'dark' class on the <html> element
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // If the theme is not yet determined, render nothing or a placeholder/loader.
  // This avoids showing the UI with a potentially incorrect theme state initially.
  if (theme === null) {
    // You can return a loader component here if desired, e.g., <LoadingSpinner />
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Theme</h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Select your preferred theme.</p>
      <div className="mt-4">
        <button onClick={toggleTheme} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700">
          Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>
    </div>
  );
}
