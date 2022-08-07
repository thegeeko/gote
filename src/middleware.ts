/* eslint-disable */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
/* eslint-enable */

import { nanoid } from "nanoid";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (request.cookies.get("owner-token")) return;

  const response = NextResponse.next();
  response.cookies.set("owner-token", nanoid(), { sameSite: "strict" });

  return response;
}

// See "Matching Paths" below to learn more
export const config = {};
