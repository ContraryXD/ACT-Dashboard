import React from "react";
import ThemeSettings from "./ThemeSettings"; // Import the new client component

export default function Settings() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Settings</h1>
      <ThemeSettings />
    </div>
  );
}
