import sqlite3 from "sqlite3";
import { open, Database } from "sqlite"; // This should now be found after npm install
import path from "path";
import fs from "fs/promises"; // Changed from require to import

// Define an interface for the query parameters
interface QueryParams {
   query: string;
   values?: any[];
}

// Singleton promise for the database connection
let dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>> | null = null;

const DB_FOLDER_PATH = path.join(process.cwd(), "src", "lib", "db"); // Path to your SQLite database folder
const DB_FILE_PATH = path.join(DB_FOLDER_PATH, "act.db"); // Path to your SQLite database file

async function ensureDbDirectoryExists() {
   try {
      await fs.mkdir(DB_FOLDER_PATH, { recursive: true });
   } catch (error) {
      console.error("Failed to create database directory:", error);
      throw error; // Re-throw if directory creation fails
   }
}

async function getDbConnection() {
   if (!dbPromise) {
      dbPromise = ensureDbDirectoryExists()
         .then(() =>
            open<sqlite3.Database, sqlite3.Statement>({
               filename: DB_FILE_PATH, // Updated path
               driver: sqlite3.Database
            })
         )
         .then(async (db: Database<sqlite3.Database, sqlite3.Statement>) => {
            // Added explicit type for db
            // Enable
            //  WAL mode for better concurrency and performance.
            await db.run("PRAGMA journal_mode = WAL;");
            // Optional: Increase busy_timeout if you expect contention, though WAL helps a lot.
            // await db.run('PRAGMA busy_timeout = 5000;');
            return db;
         });
   }
   return dbPromise;
}

export async function query({ query, values = [] }: QueryParams) {
   const db = await getDbConnection();

   try {
      // For SELECT queries, use db.all(). For INSERT/UPDATE/DELETE, use db.run().
      // Heuristic: if query starts with SELECT (case-insensitive), use all(). Otherwise, run().
      if (query.trim().toUpperCase().startsWith("SELECT")) {
         const results = await db.all(query, values);
         return results;
      } else {
         const result = await db.run(query, values);
         // For INSERT, SQLite provides lastID. For UPDATE/DELETE, changes.
         // Ensure lastID and changes are numbers, or undefined if not applicable.
         const lastID = typeof result.lastID === "number" ? result.lastID : undefined;
         const changes = typeof result.changes === "number" ? result.changes : undefined;
         return { affectedRows: changes, insertId: lastID, ...result };
      }
   } catch (error) {
      console.error("Database error:", error);
      throw error;
   }
   // No need to manually close the connection with this setup,
   // as the 'sqlite' library manages the connection lifecycle based on the promise.
}

// Function to initialize the database schema
export async function initializeSchema() {
   const db = await getDbConnection();
   const schemaPath = path.join(process.cwd(), "act.sql");
   try {
      const schema = await fs.readFile(schemaPath, "utf-8");
      // SQLite does not support executing multiple statements directly with `db.exec` from `sqlite` package in one go if they are not ; separated in a single string.
      // And `db.exec` is generally for multiple statements. For single or ; separated, `db.run` or `db.all` is fine.
      // However, act.sql contains multiple DROP TABLE, CREATE TABLE, INSERT INTO statements.
      // The `db.exec` method is suitable for this.
      await db.exec(schema);
      console.log("Database schema initialized successfully from act.sql");
   } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
         console.error("act.sql not found. Please ensure it is in the project root.");
      } else {
         console.error("Error initializing database schema:", error);
      }
      throw error; // Re-throw to indicate failure
   }
}

// Optional: Call initializeSchema when the server starts or through a specific script.
// For Next.js, this could be in a custom server setup or a one-time script.
// Example of how you might trigger it (e.g. in a script or server startup):
// initializeSchema().catch(err => console.error('Failed to initialize DB on startup:', err));
