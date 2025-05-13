import mysql from 'mysql2/promise';

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
      // Log the detailed error on the server, but don't expose it to the client
      console.error("Database Query Error:", error);
      await connection.end(); // Ensure connection is closed on error
      // You might want to throw a more generic error or handle specific DB errors
      throw new Error('A database error occurred.');
   }
}