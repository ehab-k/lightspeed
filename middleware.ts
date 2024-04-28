import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const url = new URL(request.url);
  if (
    url.pathname ===
    "/089d1bfdb4e54328a59574fb7ac4e473b32134ed9982a399929388d97e08f2dd/loader.js"
  ) {
    // Block the request by returning a 404 response
    return new NextResponse("Not Found", { status: 404 });
  }
  const cspHeader = `
    default-src 'none';
    script-src 'self' 'nonce-UNIQUE_NONCE'
    style-src 'self' 'nonce-${nonce}';
    img-src 'self';
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    default-src 'self';
    navigate-to 'self';
    block-uri "/089d1bfdb4e54328a59574fb7ac4e473b32134ed9982a399929388d97e08f2dd/loader.js";
`;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );

  if (response.status === 307) {
    // If so, change the response to prevent the redirect
    return new NextResponse("OK", { status: 200 }); // Or choose another status code
  }

  return response;
}
