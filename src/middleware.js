import { NextResponse } from "next/server";

export function middleware(req) {
  const origin = req.headers.get("origin");

  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
  ];

  if (origin && allowedOrigins.includes(origin)) {
    const res = NextResponse.next();
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
  }

  return NextResponse.next();
}

// Apply middleware to API routes only
export const config = {
  matcher: "/api/:path*",
};
