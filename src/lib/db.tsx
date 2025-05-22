import mysql from "mysql2/promise";

// Define an interface for the query parameters
interface QueryParams {
  query: string;
  values?: any[];
}

export async function query({ query, values = [] }: QueryParams) {
  // Note: It's good practice to use connection pooling for production applications
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 10000, // Optional: connection timeout in milliseconds
  });

  try {
    const [results] = await connection.execute(query, values);
    await connection.end();
    return results;
  } catch (error) {
    await connection.end();
    console.error("Database error:", error); // <-- Show the real error!
    throw error; // <-- Throw the original error, not a generic one
  }
}
