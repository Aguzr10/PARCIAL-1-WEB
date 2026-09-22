// Importamos 'server-only' para garantizar que este módulo SOLO se ejecute en el servidor.
// Esto evita que los diccionarios JSON se incluyan innecesariamente en el JavaScript del cliente.
import 'server-only'

// Mapa de diccionarios: cada idioma tiene una función que importa asíncronamente su archivo JSON.
// Esto optimiza el rendimiento porque solo se descarga en memoria el idioma solicitado.
const dictionaries = {
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
}

// Tipo que define los idiomas válidos soportados ('es' | 'en')
export type Locale = keyof typeof dictionaries

// Lista de idiomas soportados e idioma por defecto
export const locales: Locale[] = ['es', 'en']
export const defaultLocale: Locale = 'es'

// Función de validación (Type Guard) para verificar si un string es un Locale válido
export const hasLocale = (locale: string): locale is Locale => {
  return locale in dictionaries
}

// Función principal para obtener el diccionario según el idioma de forma asíncrona.
// Se invoca dentro de Server Components (layouts y pages).
export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]()
}
