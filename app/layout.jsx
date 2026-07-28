import { Head } from 'nextra/components'
import './globals.css'

export const metadata = {
  title: 'Jiji - Deploy containers anywhere',
  description: 'Deploy containerized apps across any Linux servers with zero-downtime rollouts, automatic HTTPS, and private WireGuard networking. No control plane required.',
  openGraph: {
    title: 'Jiji - Deploy containers anywhere',
    description: 'Production container deploys across servers you control. No agents, hosted platform, or cluster to babysit.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" className="dark" suppressHydrationWarning>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;700;800;900&family=Courier+Prime:wght@400;700&family=Archivo:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
