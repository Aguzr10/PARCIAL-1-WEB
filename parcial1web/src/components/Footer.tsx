interface FooterProps {
  copyright?: string
  credits?: string
}

export function Footer({
  copyright = '© 2026 Pawsome Advice. Todos los derechos reservados.',
  credits = 'Las imágenes son proporcionadas por Dog CEO API y los consejos por Advice Slip API.',
}: FooterProps) {
  return (
    <footer className="w-full bg-[#2E4053] text-[#CBD5E1] text-xs py-4 border-t border-[#1E293B] mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <p className="font-normal">{copyright}</p>
        <p className="font-light text-slate-300">{credits}</p>
      </div>
    </footer>
  )
}

export default Footer
