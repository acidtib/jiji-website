'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function DocsAccessibility() {
  const pathname = usePathname()

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const copyOptions = document.querySelector('button[aria-haspopup="listbox"]:not([aria-label])')
      copyOptions?.setAttribute('aria-label', 'Copy page options')
    })

    return () => cancelAnimationFrame(frame)
  }, [pathname])

  return null
}
