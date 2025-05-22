import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Clone the request headers to be able to modify them
    const requestHeaders = new Headers(request.headers);
    const response = NextResponse.next({
        request: {
            // New request headers
            headers: requestHeaders,
        },
    });

    // Apply CORS headers to API responses
    if (request.nextUrl.pathname.startsWith("/api/")) {
        // IMPORTANT: Use the full origin, including the protocol
        response.headers.set("Access-Control-Allow-Origin", "http://localhost:3001");
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        // Handle preflight requests
        if (request.method === 'OPTIONS') {
            // For OPTIONS, we can return a simple 204 response with the CORS headers
            // Some browsers might expect a 200 or 204. 204 is common for preflight.
            return new NextResponse(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "http://localhost:3001",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                }
            });
        }
    }

    return response;
}

// Optionally, specify which paths to match
export const config = {
    matcher: ["/api/:path*"],
};