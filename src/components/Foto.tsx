import Image from 'next/image'

import type { Media } from '@/payload-types'
import { Icone } from './Icone'

type Props = {
  media: Media | null
  /** Texto mostrado no lugar da foto enquanto ela não for cadastrada. */
  placeholder: string
  tom?: 'laranja' | 'azul' | 'verde'
  tamanho?: 'card' | 'hero'
  className?: string
  sizes?: string
  priority?: boolean
}

export function Foto({ media, placeholder, tom = 'laranja', tamanho = 'card', className = '', sizes, priority }: Props) {
  const url = media?.sizes?.[tamanho]?.url || media?.url

  if (!media || !url) {
    return (
      <div className={`foto foto--vazia foto--${tom} ${className}`}>
        <Icone nome="foto" tamanho={32} />
        <span>{placeholder}</span>
      </div>
    )
  }

  return (
    <div className={`foto ${className}`}>
      <Image
        src={url}
        alt={media.alt}
        fill
        sizes={sizes ?? '(max-width: 768px) 100vw, 50vw'}
        priority={priority}
        style={{ objectFit: 'cover', objectPosition: `${media.focalX ?? 50}% ${media.focalY ?? 50}%` }}
      />
    </div>
  )
}
