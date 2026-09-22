import Link from 'next/link'
import Image from 'next/image'
import { BgColorBreed } from '@/lib/breeds'

interface BreedCardProps {
  breed: string
  imageUrl: string
  lang: string
}

export function BreedCard({ breed, imageUrl, lang }: BreedCardProps) {
  const displayName = breed.charAt(0).toUpperCase() + breed.slice(1)
  const bgClass = BgColorBreed[breed.toLowerCase()] || 'bg-amber-100'

  return (
    <Link
      href={`/${lang}/${breed.toLowerCase()}?img=${encodeURIComponent(imageUrl)}`}
      className={`group block ${bgClass} rounded-2xl p-4 shadow-sm border border-black/10 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1`}
    >
      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-black/5 mb-3 flex items-center justify-center">
        <Image
          src={imageUrl}
          alt={displayName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <h3 className="text-center font-medium text-slate-800 text-sm tracking-wide capitalize">
        {displayName}
      </h3>
    </Link>
  )
}

export default BreedCard
