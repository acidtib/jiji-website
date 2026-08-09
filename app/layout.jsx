import { Head } from 'nextra/components'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const siteUrl = 'https://jiji.run'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Jiji: Open-Source Container Deployment for Linux Servers',
    template: '%s | Jiji',
  },
  description: 'Deploy Docker and Podman containers across Linux servers with zero-downtime rollouts, automatic HTTPS, and private WireGuard networking.',
  applicationName: 'Jiji',
  authors: [{ name: 'Jiji', url: 'https://github.com/acidtib/jiji' }],
  creator: 'Jiji',
  publisher: 'Jiji',
  keywords: [
    'container deployment',
    'container orchestration',
    'Docker deployment',
    'Podman deployment',
    'zero-downtime deployment',
    'WireGuard',
    'self-hosting',
    'Linux servers',
  ],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: '/jiji_icon.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/jiji_icon.svg',
    apple: {
      url: '/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Jiji',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jiji open-source container deployment for Linux servers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className="dark"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;700;800;900&family=Courier+Prime:wght@400;700&family=Archivo:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
