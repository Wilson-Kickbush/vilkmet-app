import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export const updateSession = async (request: NextRequest) => {
  // Respuesta inicial
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Cliente Supabase optimizado para Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Obtener usuario actual
  const { data: { user } } = await supabase.auth.getUser()

  // Bloquear /admin si no hay usuario
  if (request.nextUrl.pathname.startsWith("/admin") && !user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Si ya hay usuario y está en /login, enviarlo a /admin
  if (request.nextUrl.pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return response
}
