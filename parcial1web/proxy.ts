import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { locales, defaultLocale } from './lib/dictionaries'

/**
 * Función auxiliar para detectar el idioma preferido del usuario.
 * 
 * 1. PERSISTENCIA: Primero revisa si existe la cookie 'NEXT_LOCALE' (si el usuario
 *    ya seleccionó manualmente un idioma antes).
 * 2. DETECCIÓN AUTOMÁTICA: Si no hay cookie, lee las cabeceras HTTP 'Accept-Language'
 *    del navegador del usuario y encuentra la mejor coincidencia con nuestros idiomas.
 */
function getLocale(request: NextRequest): string {
  // 1. Verificar persistencia en Cookies
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && locales.includes(cookieLocale as (typeof locales)[number])) {
    return cookieLocale
  }

  // 2. Extraer cabeceras del navegador para el negociador
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value
  })

  // 3. Negociar el idioma preferido del navegador frente a los soportados ('es', 'en')
  try {
    const rawLanguages = new Negotiator({ headers: negotiatorHeaders }).languages()
    // Filtrar caracteres especiales como '*' que pueden no ser etiquetas BCP-47 canónicas
    const validLanguages = rawLanguages.filter(
      (lang) => lang && lang !== '*' && /^[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*$/.test(lang)
    )

    if (validLanguages.length > 0) {
      return match(validLanguages, locales, defaultLocale)
    }
  } catch {
    // Si ocurre un error al procesar las cabeceras, usamos el idioma por defecto
    return defaultLocale
  }

  return defaultLocale
}

/**
 * Proxy de Next.js (convención oficial de Next.js 16 para interceptar peticiones en el borde).
 * Gestiona la redirección automática basada en preferencias y la persistencia de idioma.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar si la URL actual ya incluye un prefijo de idioma soportado (ej. /es, /es/profile, /en)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Si ya tiene el prefijo de idioma, dejamos continuar la petición sin hacer redirección
  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Si NO tiene prefijo (ej. el usuario entró a "/" o a "/profile"), detectamos el idioma
  const locale = getLocale(request)

  // Modificamos la ruta agregando el prefijo de idioma correspondiente (ej. "/es" o "/en/profile")
  request.nextUrl.pathname = `/${locale}${pathname}`

  // Redirigimos al usuario a la nueva URL con el prefijo
  return NextResponse.redirect(request.nextUrl)
}

/**
 * Configuración del matcher para el Proxy:
 * Se interceptan todas las rutas EXCEPTO:
 * - /api/... (rutas de backend / endpoints)
 * - /_next/... (archivos internos de Next.js como scripts y estilos compilados)
 * - /favicon.ico y archivos de recursos estáticos
 */
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
