import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '@/lib/dictionaries'

/**
 * Página principal (Home) renderizada en el servidor (Server Component).
 * 
 * REQUERIMIENTO:
 * - Uso obligatorio de la llave "welcome" del modelo de datos:
 *   es.json -> {"welcome": "Bienvenido"}
 *   en.json -> {"welcome": "Welcome"}
 * - Cero texto hardcodeado.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  // Validación de seguridad de idioma
  if (!hasLocale(lang)) {
    notFound()
  }

  // Carga asíncrona del diccionario en el servidor
  const dict = await getDictionary(lang)

  return (
    <>
      {/* Sección Hero con la llave requerida "welcome" */}
      <section className="card hero-card">
        <h1 className="hero-welcome">{dict.welcome}</h1>
        <h2 className="hero-subtitle">{dict.subtitle}</h2>
        <p className="hero-description">{dict.description}</p>
        
        <div className="actions-row">
          <Link href={`/${lang}/profile`} className="btn btn-primary">
            {dict.actions.goToProfile}
          </Link>
          <a
            href="https://github.com/Aguzr10/Preparcial-1-WEB"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            {dict.actions.viewOnGithub}
          </a>
        </div>
      </section>

      {/* Tarjeta de Requerimientos y Características */}
      <section className="card">
        <h2 className="hero-subtitle">{dict.featuresTitle}</h2>
        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon">1</span>
            <p className="feature-text">{dict.features.routing}</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">2</span>
            <p className="feature-text">{dict.features.proxy}</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">3</span>
            <p className="feature-text">{dict.features.dictionaries}</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">4</span>
            <p className="feature-text">{dict.features.persistence}</p>
          </div>
        </div>
      </section>

      {/* Sección de preparación para el Parcial (Demostración de API) */}
      <section className="card">
        <span className="brand-badge">{dict.apiSection.badge}</span>
        <h2 className="hero-subtitle" style={{ marginTop: '0.75rem' }}>
          {dict.apiSection.title}
        </h2>
        <p className="hero-description">{dict.apiSection.description}</p>
        <div className="actions-row">
          <a
            href="/api/items"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            {dict.apiSection.button}
          </a>
        </div>
      </section>
    </>
  )
}
