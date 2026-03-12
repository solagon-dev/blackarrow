import ScrollReveal from './ScrollReveal'

interface SectionHeaderProps {
  label?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  light?: boolean
}

export default function SectionHeader({ label, title, description, align = 'left', light = false }: SectionHeaderProps) {
  const centered = align === 'center'

  return (
    <ScrollReveal className={`${centered ? 'max-w-3xl mx-auto text-center' : 'max-w-3xl'} mb-12 lg:mb-16`}>
      {label && (
        <div className="flex items-center gap-3 mb-4 justify-start">
          {centered && <div className={`h-px w-12 ${light ? 'bg-brand-400/60' : 'bg-brand-200'}`} />}
          <p className={`section-label mb-0 ${light ? 'text-brand-400' : ''}`}>{label}</p>
          {!centered && <div className={`h-px w-12 ${light ? 'bg-brand-400/60' : 'bg-brand-200'}`} />}
        </div>
      )}
      <h2 className={`mb-4 ${light ? 'text-white' : ''}`}>{title}</h2>
      {description && (
        <p className={`text-lg leading-relaxed ${light ? 'text-navy-200' : 'text-navy-600'}`}>
          {description}
        </p>
      )}
    </ScrollReveal>
  )
}
