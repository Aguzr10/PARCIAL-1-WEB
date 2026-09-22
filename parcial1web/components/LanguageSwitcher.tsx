'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'

interface LanguageSwitcherProps {
  currentLang: string
  label: string
}

export default function LanguageSwitcher({ currentLang, label }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleLanguageChange = (newLang: string) => {
    if (newLang === currentLang) return

    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000; SameSite=Lax`

    const segments = pathname.split('/')
    segments[1] = newLang
    const newPath = segments.join('/') || `/${newLang}`

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
