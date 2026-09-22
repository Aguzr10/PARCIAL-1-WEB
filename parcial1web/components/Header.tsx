import Link from 'next/link'
import Image from 'next/image'
import LanguageSwitcher from '@/components/LanguageSwitcher'

interface HeaderProps {
  lang?: string
  selectLanguageLabel?: string
}

export function Header({ lang = 'es', selectLanguageLabel = 'Idioma:' }: HeaderProps) {
  return (
    <header className="w-full bg-[#FF6B35] shadow-sm relative">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <div className="w-24 hidden sm:block" />

        
        <div className="flex-1 flex justify-center">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center transition-transform hover:scale-105"
            aria-label="Pawsome Advice Home"
          >
            <Image
              src="/pawsome-advice-logo.png"
              alt="Pawsome Advice"
              width={210}
              height={58}
              priority
              className="h-12 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Selector de idioma */}
        <div className="flex justify-end">
          <LanguageSwitcher currentLang={lang} label={selectLanguageLabel} />
        </div>
      </div>
    </header>
  )
}

export default Header
