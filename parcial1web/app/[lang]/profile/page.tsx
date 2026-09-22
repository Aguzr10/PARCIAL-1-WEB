import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '@/lib/dictionaries'

/**
 * Página de Perfil (Profile Page) renderizada en el servidor (Server Component).
 * 
 * REQUERIMIENTOS:
 * - Uso obligatorio de la llave "profile" del modelo de datos:
 *   es.json -> {"profile": "Perfil"}
 *   en.json -> {"profile": "Profile"}
 * - Comprobar que el enrutamiento dinámico (/es/profile, /en/profile) funcione.
 * - Cero texto quemado (hardcodeado).
 */
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  if (!hasLocale(lang)) {
    notFound()
  }

  const dict = await getDictionary(lang)

  return (
    <section className="card">
      <div className="profile-header">
        <div className="profile-avatar">
          AG
        </div>
        <div>
          {/* Llave obligatoria del PDF: "profile" */}
          <h1 className="hero-welcome">{dict.profile}</h1>
          <p className="hero-subtitle">{dict.profileSection.title}</p>
        </div>
      </div>

      <div className="profile-info-grid">
        <div className="info-box">
          <p className="info-label">{dict.profileSection.nameLabel}</p>
          <p className="info-value">{dict.profileSection.nameValue}</p>
        </div>

        <div className="info-box">
          <p className="info-label">{dict.profileSection.courseLabel}</p>
          <p className="info-value">{dict.profileSection.courseValue}</p>
        </div>

        <div className="info-box">
          <p className="info-label">{dict.profileSection.universityLabel}</p>
          <p className="info-value">{dict.profileSection.universityValue}</p>
        </div>

        <div className="info-box">
          <p className="info-label">{dict.profileSection.preferenceLabel}</p>
          <p className="info-value">
            {dict.currentLanguageName} ({lang.toUpperCase()})
          </p>
        </div>
      </div>

      <div className="info-box" style={{ marginBottom: '1.5rem' }}>
        <p className="info-label">{dict.profileSection.statusLabel}</p>
        <div style={{ marginTop: '0.5rem' }}>
          <span className="badge-success">
            {dict.profileSection.statusActive}
          </span>
        </div>
      </div>

      <div className="actions-row">
        <Link href={`/${lang}`} className="btn btn-primary">
          {dict.actions.backHome}
        </Link>
      </div>
    </section>
  )
}
