'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function DocsFeedbackLink() {
  const labelRef = useRef(null)
  const pathname = usePathname()

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const link = labelRef.current?.closest('a')
      const pageTitle = document.querySelector('main h1')?.textContent?.trim()

      if (!link || !pageTitle) return

      const params = new URLSearchParams({
        title: `Feedback for “${pageTitle}”`,
        labels: 'feedback',
      })

      link.href = `https://github.com/acidtib/jiji/issues/new?${params}`
    })

    return () => cancelAnimationFrame(frame)
  }, [pathname])

  return <span ref={labelRef}>Question? Give us feedback</span>
}
