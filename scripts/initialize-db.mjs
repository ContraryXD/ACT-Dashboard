import { initializeSchema } from "../src/lib/db.js"; // Adjusted path to use .js for ES Modules

async function main() {
   console.log("Attempting to initialize database schema...");
   try {
      await initializeSchema();
      console.log("Database schema initialization successful.");
   } catch (error) {
      console.error("Failed to initialize database schema:", error);
      process.exit(1); // Exit with error code
   }
}

main();
