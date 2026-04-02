import { NextRequest, NextResponse } from "next/server";

// ============================================================
// RATE LIMITING (In-memory store — simple para monoplanta)
// En producción multi-instancia usar: https://upstash.com/redis
// ============================================================
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hora
const RATE_LIMIT_MAX = 10; // máx 10 requests de cotización por IP por hora

function getRateLimitResult(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

import { updateSession } from "@/utils/supabase/middleware";

// ============================================================
// SECURITY HEADERS
// ============================================================
const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval requerido por Next.js dev
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
  ].join("; "),
};

export async function middleware(request: NextRequest) {
  // 1. Actualizar sesión de Auth y proteger rutas
  const authResponse = await updateSession(request);
  
  // Si updateSession ya manejó una redirección, la respetamos
  if (authResponse.status === 307 || authResponse.status === 308) {
    return authResponse;
  }

  // 2. Aplicar headers de seguridad a la respuesta actual
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    authResponse.headers.set(key, value);
  });

  // 3. Rate limiting solo en la API del cotizador público
  if (request.nextUrl.pathname === "/api/quote" && request.method === "POST") {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "anonymous";

    const { allowed, remaining } = getRateLimitResult(ip);

    authResponse.headers.set("X-RateLimit-Limit", String(RATE_LIMIT_MAX));
    authResponse.headers.set("X-RateLimit-Remaining", String(remaining));

    if (!allowed) {
      return new NextResponse(
        JSON.stringify({
          error: "Demasiadas solicitudes. Por favor, intentá de nuevo en una hora.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
            "X-RateLimit-Remaining": "0",
            "Retry-After": "3600",
          },
        }
      );
    }
  }

  return authResponse;
}

export const config = {
  matcher: [
    // Aplicar a todas las rutas excepto estáticos e imágenes de Next
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.webp).*)",
  ],
};
