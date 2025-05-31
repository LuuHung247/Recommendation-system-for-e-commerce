import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Example of using cookies in middleware if needed
  const userIndex = request.cookies.get("user_index")?.value;

  // Just return the request as is for now
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Add paths that should use this middleware
    // '/profile/:path*',
  ],
};
