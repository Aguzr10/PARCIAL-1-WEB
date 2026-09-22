'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface RandomBreedButtonProps {
  allBreeds: string[]
  lang: string
  label?: string
  loadingLabel?: string
}

export function RandomBreedButton({
  allBreeds,
  lang,
  label = 'Random',
  loadingLabel = 'Generando...',
}: RandomBreedButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleRandomClick = async () => {
    if (loading) return
    setLoading(true)

    try {
      // 1. Elegir una raza aleatoria de la lista completa de razas
      const availableBreeds = allBreeds.length > 0
        ? allBreeds
        : ['akita', 'beagle', 'boxer', 'chihuahua', 'husky', 'poodle', 'pug', 'samoyed']
      const randomBreed = availableBreeds[Math.floor(Math.random() * availableBreeds.length)]

      // 2 y 3. En paralelo, obtener imagen aleatoria y consejo aleatorio
      const [imgRes, adviceRes] = await Promise.all([
        fetch(`https://dog.ceo/api/breed/${randomBreed.toLowerCase()}/images/random`),
        fetch(`https://api.adviceslip.com/advice?t=${Date.now()}`),
      ])

      const imgData = await imgRes.json()
      const adviceData = await adviceRes.json()

      const imageUrl = imgData.status === 'success' ? imgData.message : ''
      const advice = adviceData.slip?.advice || 'Be kind to every dog you meet.'
      const adviceId = adviceData.slip?.id || 0

      // 4. Navegar a la página de Detalle pasando imagen, consejo e ID para no tener que volver a pedirlos
      const query = new URLSearchParams({
        img: imageUrl,
        advice: advice,
        id: adviceId.toString(),
      })

      router.push(`/${lang}/${randomBreed.toLowerCase()}?${query.toString()}`)
    } catch (error) {
      console.error('Error generating random breed and advice:', error)
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleRandomClick}
      disabled={loading}
      className="bg-[#FF6B35] hover:bg-[#e85b27] text-white font-medium px-5 py-2 rounded-full text-sm shadow-sm transition-all duration-150 disabled:opacity-75 disabled:cursor-not-allowed hover:shadow cursor-pointer flex items-center gap-2"
    >
      {loading ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        label
      )}
    </button>
  )
}

export default RandomBreedButton
