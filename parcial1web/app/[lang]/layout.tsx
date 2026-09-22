import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, locales } from '@/lib/dictionaries'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import '../globals.css'

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)
  return {
    title: dict.home.title,
    description: dict.home.description,
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  if (!hasLocale(lang)) {
    notFound()
  }

  const dict = await getDictionary(lang)

  return (
    <html lang={lang}>
      <body className="min-h-screen flex flex-col m-0 p-0 bg-[#F5F5F0]">
        <Header lang={lang} selectLanguageLabel={dict.selectLanguage} />
        <main className="flex-1 w-full bg-[#F5F5F0]">
          {children}
        </main>
        <Footer copyright={dict.footer.copyright} credits={dict.footer.credits} />
      </body>
    </html>
  )
}
