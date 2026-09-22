'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'

interface LanguageSwitcherProps {
  currentLang: string
  label: string
}

/**
 * Componente cliente para cambiar de idioma y persistir la preferencia.
 * 
 * ¿Cómo funciona la persistencia?
 * 1. Cuando el usuario hace clic en un idioma, se guarda una cookie llamada 'NEXT_LOCALE'.
 * 2. La cookie tiene una duración de 1 año (max-age=31536000).
 * 3. En peticiones futuras, el 'proxy.ts' leerá esta cookie para recordar el idioma elegido.
 * 4. Luego se reemplaza el prefijo de la URL actual (ej. de /es/profile a /en/profile).
 */
export default function LanguageSwitcher({ currentLang, label }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleLanguageChange = (newLang: string) => {
    if (newLang === currentLang) return

    // 1. Guardar la cookie en el navegador para persistencia
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000; SameSite=Lax`

    // 2. Calcular la nueva ruta reemplazando el segmento inicial de idioma
    // Ejemplo: /es -> /en, o /es/profile -> /en/profile
    const segments = pathname.split('/')
    segments[1] = newLang
    const newPath = segments.join('/') || `/${newLang}`

    // 3. Navegar suavemente a la nueva ruta
    startTransition(() => {
      router.push(newPath)
      router.refresh()
    })
  }

  return (
    <div className="language-switcher" aria-label="Language Selector">
      <span className="language-switcher-label">{label}</span>
      <div className="language-buttons">
        <button
          type="button"
          onClick={() => handleLanguageChange('es')}
          disabled={isPending}
          className={`lang-btn ${currentLang === 'es' ? 'lang-btn-active' : ''}`}
          aria-current={currentLang === 'es' ? 'true' : undefined}
        >
          ES
        </button>
        <button
          type="button"
          onClick={() => handleLanguageChange('en')}
          disabled={isPending}
          className={`lang-btn ${currentLang === 'en' ? 'lang-btn-active' : ''}`}
          aria-current={currentLang === 'en' ? 'true' : undefined}
        >
          EN
        </button>
      </div>
    </div>
  )
}
