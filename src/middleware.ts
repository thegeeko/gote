/* eslint-disable */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
/* eslint-enable */
import { nanoid } from "nanoid";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	console.log("req :", request.cookies.get("owner-token"))
	if (request.cookies.get("owner-token")) return;

	const response = NextResponse.next();
	response.cookies.set("owner-token", nanoid(), { sameSite: "strict" })

	console.log("res :", response.cookies.get("owner-token"))
	return response;
}

// See "Matching Paths" below to learn more
export const config = {
}
