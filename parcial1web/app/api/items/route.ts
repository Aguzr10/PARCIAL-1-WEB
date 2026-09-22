import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * ============================================================================
 * GUÍA DIDÁCTICA DE APIS EN NEXT.JS APP ROUTER (PARA TU PARCIAL)
 * ============================================================================
 * 
 * En Next.js App Router, para crear una API NO usamos páginas normales,
 * sino archivos llamados 'route.ts' dentro de carpetas bajo 'app/api/'.
 * 
 * Cada función exportada corresponde al método HTTP:
 * - export async function GET(request: NextRequest) { ... }
 * - export async function POST(request: NextRequest) { ... }
 * - export async function PUT(request: NextRequest) { ... }
 * - export async function DELETE(request: NextRequest) { ... }
 */

// Datos de ejemplo simulados (Mock Data)
const sampleItems = [
  { id: 1, name: 'Next.js 16 App Router', category: 'Framework', status: 'Active' },
  { id: 2, name: 'FormatJS LocaleMatcher', category: 'i18n', status: 'Installed' },
  { id: 3, name: 'Negotiator Accept-Language', category: 'i18n', status: 'Installed' },
  { id: 4, name: 'Cookie Persistence (NEXT_LOCALE)', category: 'State', status: 'Configured' }
]

/**
 * Endpoint GET: /api/items
 * 
 * ¿Cómo probarlo?
 * - Abre en tu navegador: http://localhost:3000/api/items
 * - Con filtro: http://localhost:3000/api/items?category=i18n
 */
export async function GET(request: NextRequest) {
  // 1. CÓMO LEER QUERY PARAMS (Parámetros en la URL ej. ?category=i18n):
  const { searchParams } = request.nextUrl
  const categoryFilter = searchParams.get('category')

  let results = sampleItems
  if (categoryFilter) {
    results = results.filter(
      (item) => item.category.toLowerCase() === categoryFilter.toLowerCase()
    )
  }

  // 2. CÓMO CONSUMIR UNA API EXTERNA CON DOCUMENTACIÓN LIBRE (Si el profe lo pide):
  // Ejemplo didáctico (descomentar para usar una API pública como PokeAPI o JSONPlaceholder):
  /*
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5', {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 } // Opcional: Cache por 60 segundos
    })
    const externalData = await response.json()
    return NextResponse.json({ success: true, data: externalData })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al consultar API externa' }, { status: 500 })
  }
  */

  // 3. CÓMO RETORNAR UNA RESPUESTA JSON:
  return NextResponse.json(
    {
      success: true,
      timestamp: new Date().toISOString(),
      message: 'API Route funcionando correctamente en Next.js App Router',
      count: results.length,
      data: results
    },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    }
  )
}

/**
 * Endpoint POST: /api/items
 * Ejemplo didáctico de cómo recibir datos enviados en el Body (JSON)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validación simple
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'El campo "name" es obligatorio' },
        { status: 400 }
      )
    }

    const newItem = {
      id: Date.now(),
      name: body.name,
      category: body.category || 'General',
      status: 'Created'
    }

    return NextResponse.json(
      { success: true, message: 'Elemento creado exitosamente', data: newItem },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: 'Cuerpo de la petición inválido' },
      { status: 400 }
    )
  }
}
