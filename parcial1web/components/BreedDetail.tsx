'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BgColorCategory, BorderColorCategory } from '@/lib/breeds'

interface BreedDetailProps {
  breed: string
  initialImageUrl: string
  initialAdvice: string
  initialAdviceId: number
  randomButtonLabel?: string
  loadingLabel?: string
}

export function BreedDetail({
  breed,
  initialImageUrl,
  initialAdvice,
  initialAdviceId,
  randomButtonLabel = 'Random',
  loadingLabel = 'Cargando...',
}: BreedDetailProps) {
  const [imageUrl, setImageUrl] = useState(initialImageUrl)
  const [advice, setAdvice] = useState(initialAdvice)
  const [adviceId, setAdviceId] = useState(initialAdviceId)
  const [loading, setLoading] = useState(false)

  const displayName = breed.charAt(0).toUpperCase() + breed.slice(1)

  // Color de fondo correspondiente a la categoría del consejo: (id del consejo) % 5
  const categoryIndex = Math.abs(adviceId) % 5
  const bgCategoryClass = BgColorCategory[categoryIndex] || 'bg-[#BFDBFE]'
  const borderCategoryClass = BorderColorCategory[categoryIndex] || 'border-[#93C5FD]'

  // Botón Random del Detalle: refetch a nivel de cliente sin recargar la página ni crear link
  const handleRefetch = async () => {
    if (loading) return
    setLoading(true)

    try {
      const [imgRes, adviceRes] = await Promise.all([
        fetch(`https://dog.ceo/api/breed/${breed.toLowerCase()}/images/random`),
        fetch(`https://api.adviceslip.com/advice?t=${Date.now()}`),
      ])

      const imgData = await imgRes.json()
      const adviceData = await adviceRes.json()

      if (imgData.status === 'success' && imgData.message) {
        setImageUrl(imgData.message)
      }

      if (adviceData.slip) {
        setAdvice(adviceData.slip.advice)
        setAdviceId(adviceData.slip.id)
      }
    } catch (error) {
      console.error('Error refetching image and advice in detail:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex justify-center items-center py-6 px-4">
      {/* Tarjeta con fondo dinámico asignado por categoría (id del consejo % 5) */}
      <div
        className={`${bgCategoryClass} ${borderCategoryClass} border w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-sm transition-colors duration-300 flex flex-col items-center text-center`}
      >
        {/* Nombre de la raza */}
        <h1 className="text-xl sm:text-2xl font-medium text-slate-800 mb-4 tracking-wide capitalize">
          {displayName}
        </h1>

        {/* Imagen del perro con componente <Image> de Next.js */}
        <div className="relative w-full max-w-[420px] h-64 sm:h-72 rounded-2xl overflow-hidden bg-black/10 shadow-inner mb-4 flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`Perro de raza ${displayName}`}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 420px"
              className={`object-cover transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}
            />
          ) : (
            <div className="text-slate-500 text-sm">{loadingLabel}</div>
          )}
        </div>

        {/* Texto del consejo (advice) entre comillas */}
        <p className="text-slate-800 text-sm sm:text-base font-normal mb-5 px-3 min-h-[44px] flex items-center justify-center italic">
          &ldquo;{advice}&rdquo;
        </p>

        {/* Botón Random con lógica de refetch a nivel de cliente */}
        <button
          type="button"
          onClick={handleRefetch}
          disabled={loading}
          className="bg-[#FF6B35] hover:bg-[#e85b27] text-white font-medium px-7 py-2.5 rounded-full text-sm shadow transition-all duration-150 disabled:opacity-75 disabled:cursor-not-allowed hover:shadow-md cursor-pointer flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
              <span>{loadingLabel}</span>
            </>
          ) : (
            randomButtonLabel
          )}
        </button>
      </div>
    </div>
  )
}

export default BreedDetail
