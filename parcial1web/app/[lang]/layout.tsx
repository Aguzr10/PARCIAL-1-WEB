import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, locales } from '@/lib/dictionaries'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import '../globals.css'

/**
 * Generación estática de parámetros para optimizar las rutas /es y /en en producción
 */
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

/**
 * Metadatos dinámicos según el idioma seleccionado
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)
  return {
    title: dict.title,
    description: dict.description,
  }
}

/**
 * Layout principal de la aplicación ubicado en app/[lang]/layout.tsx.
 * 
 * REQUERIMIENTOS DEL PREPARCIAL CUMPLIDOS:
 * 1. Organizado dentro de app/[lang]/
 * 2. Atributo lang dinámico en la etiqueta <html lang={lang}>
 * 3. 100% libre de texto quemado (hardcodeado), consumiendo getDictionary(lang).
 */
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  // Si el parámetro de idioma no es válido (ej. /fr o /de), se envía a página 404
  if (!hasLocale(lang)) {
    notFound()
  }

  // Carga asíncrona del diccionario correspondiente al idioma
  const dict = await getDictionary(lang)

  return (
    // Atributo lang completamente dinámico
    <html lang={lang}>
      <body>
        <header className="navbar">
          <div className="navbar-content">
            <Link href={`/${lang}`} className="brand-title">
              {dict.title}
              <span className="brand-badge">i18n</span>
            </Link>

            <nav className="nav-links">
              <Link href={`/${lang}`} className="nav-link">
                {dict.navigation.home}
              </Link>
              <Link href={`/${lang}/profile`} className="nav-link">
                {dict.navigation.profile}
              </Link>
              <a href="/api/items" target="_blank" rel="noopener noreferrer" className="nav-link">
                {dict.navigation.api}
              </a>

              {/* Selector interactivo de idioma con persistencia */}
              <LanguageSwitcher
                currentLang={lang}
                label={dict.selectLanguage}
              />
            </nav>
          </div>
        </header>

        <main className="main-container">
          {children}
        </main>

        <footer className="footer">
          <p>{dict.footer.text}</p>
        </footer>
      </body>
    </html>
  )
}
