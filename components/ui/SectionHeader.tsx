import ScrollReveal from './ScrollReveal'

interface SectionHeaderProps {
  title: string
  description?: string
  align?: 'left' | 'center'
  light?: boolean
}

export default function SectionHeader({ title, description, align = 'left', light = false }: SectionHeaderProps) {
  const centered = align === 'center'

  return (
    <ScrollReveal className={`${centered ? 'max-w-3xl mx-auto text-center' : 'max-w-3xl'} mb-12 lg:mb-16`}>
      <h2 className={`mb-4 ${light ? 'text-white' : ''}`}>{title}</h2>
      {description && (
        <p className={`text-lg leading-relaxed ${light ? 'text-navy-200' : 'text-navy-600'}`}>
          {description}
        </p>
      )}
    </ScrollReveal>
  )
}
