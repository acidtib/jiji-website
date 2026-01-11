import { Head } from 'nextra/components'
import './globals.css'

export const metadata = {
  title: 'Jiji - Deploy containers anywhere',
  description: 'Deploy containers across servers with zero-downtime, automatic service discovery, and encrypted networking. No Kubernetes required.',
  openGraph: {
    title: 'Jiji - Deploy containers anywhere',
    description: 'Deploy containers across servers with zero-downtime, automatic service discovery, and encrypted networking.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" className="dark" suppressHydrationWarning>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
