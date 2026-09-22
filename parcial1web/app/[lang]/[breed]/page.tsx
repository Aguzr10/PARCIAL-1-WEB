import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '@/lib/dictionaries'
import { getRandomDogImage, getRandomAdvice } from '@/lib/breeds'
import BreedDetail from '@/components/BreedDetail'

export const dynamic = 'force-dynamic'

interface DetailPageProps {
  params: Promise<{ lang: string; breed: string }>
  searchParams: Promise<{ img?: string; advice?: string; id?: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; breed: string }>
}): Promise<Metadata> {
  const { lang, breed } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)

  const breedNameCapitalized = breed.charAt(0).toUpperCase() + breed.slice(1)
  const title = `${dict.detail.titlePrefix}${breedNameCapitalized}${dict.detail.titleSuffix}`

  return {
    title,
    description: dict.detail.description,
  }
}

export default async function BreedDetailPage({
  params,
  searchParams,
}: DetailPageProps) {
  const { lang, breed } = await params
  const { img, advice, id } = await searchParams

  if (!hasLocale(lang)) {
    notFound()
  }

  const dict = await getDictionary(lang)

  let initialImage = img
  let initialAdvice = advice
  let initialAdviceId = id ? parseInt(id, 10) : undefined

  if (!initialImage || !initialAdvice) {
    const [fetchedImage, fetchedAdvice] = await Promise.all([
      !initialImage ? getRandomDogImage(breed) : Promise.resolve(initialImage),
      !initialAdvice ? getRandomAdvice() : Promise.resolve(null),
    ])

    if (!initialImage) initialImage = fetchedImage
    if (!initialAdvice && fetchedAdvice) {
      initialAdvice = fetchedAdvice.advice
      initialAdviceId = fetchedAdvice.id
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
      <BreedDetail
        breed={breed}
        initialImageUrl={initialImage || '/pawsome-advice-logo.png'}
        initialAdvice={initialAdvice || 'Live each day to the fullest.'}
        initialAdviceId={initialAdviceId ?? 0}
        randomButtonLabel={dict.detail.randomButton}
        loadingLabel={dict.detail.loading}
      />
    </div>
  )
}
