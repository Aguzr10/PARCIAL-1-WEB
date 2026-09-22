import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const sampleItems = [
  { id: 1, name: 'Next.js 16 App Router', category: 'Framework', status: 'Active' },
  { id: 2, name: 'FormatJS LocaleMatcher', category: 'i18n', status: 'Installed' },
  { id: 3, name: 'Negotiator Accept-Language', category: 'i18n', status: 'Installed' },
  { id: 4, name: 'Cookie Persistence (NEXT_LOCALE)', category: 'State', status: 'Configured' }
]

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const categoryFilter = searchParams.get('category')

  let results = sampleItems
  if (categoryFilter) {
    results = results.filter(
      (item) => item.category.toLowerCase() === categoryFilter.toLowerCase()
    )
  }

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

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
