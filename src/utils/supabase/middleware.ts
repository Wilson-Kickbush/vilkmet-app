import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export const updateSession = async (request: NextRequest) => {
  // Respuesta inicial
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 0. EXCEPCIÓN: Permitir /admin/debug sin autenticar para rescate
  if (request.nextUrl.pathname === "/admin/debug") {
    return response;
  }

  // 1. Cliente Supabase con manejo de errores
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("ALERTA: Faltan variables de entorno de Supabase");
    return response;
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
          },
        },
      }
    )

    // Obtener usuario actual (con tiempo límite)
    const { data: { user } } = await supabase.auth.getUser()

    // Bloquear /admin si no hay usuario (excepto /admin/debug ya manejado arriba)
    if (request.nextUrl.pathname.startsWith("/admin") && !user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Si ya hay usuario y está en /login, enviarlo a /admin
    if (request.nextUrl.pathname === "/login" && user) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  } catch (error) {
    console.error("Middleware Auth Error:", error);
  }

  return response
}
