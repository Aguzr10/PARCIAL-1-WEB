import BreedCard from './BreedCard'

export interface BreedData {
  breed: string
  imageUrl: string
}

interface BreedListProps {
  breeds: BreedData[]
  lang: string
}

export function BreedList({ breeds, lang }: BreedListProps) {
  return (
    <section aria-label="Lista de razas de perros">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {breeds.map((item) => (
          <BreedCard
            key={item.breed}
            breed={item.breed}
            imageUrl={item.imageUrl}
            lang={lang}
          />
        ))}
      </div>
    </section>
  )
}

export default BreedList
