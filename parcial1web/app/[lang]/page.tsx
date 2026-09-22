import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '@/lib/dictionaries'
import { getAllBreeds, getRandomDogImage } from '@/lib/breeds'
import BreedList, { BreedData } from '@/components/BreedList'
import RandomBreedButton from '@/components/RandomBreedButton'

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

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  if (!hasLocale(lang)) {
    notFound()
  }

  const dict = await getDictionary(lang)

  // 1. Obtener la lista completa de todas las razas
  const allBreeds = await getAllBreeds()

  // 2. Extraer las primeras 15 razas sin subrazas
  const first15Breeds = allBreeds.slice(0, 15)

  // 3. Disparar la petición de su imagen aleatoria en paralelo con Promise.all
  const breedsData: BreedData[] = await Promise.all(
    first15Breeds.map(async (breed) => {
      const imageUrl = await getRandomDogImage(breed)
      return {
        breed,
        imageUrl,
      }
    })
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Barra superior con Título y Botón Random */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          {dict.home.heading}
        </h1>
        <RandomBreedButton
          allBreeds={allBreeds}
          lang={lang}
          label={dict.home.randomButton}
          loadingLabel={dict.home.loadingRandom}
        />
      </div>

      {/* Grid de las 15 tarjetas de razas */}
      <BreedList breeds={breedsData} lang={lang} />
    </div>
  )
}
