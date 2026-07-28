import LandingPage from '@/components/LandingPage'

export const metadata = {
  title: {
    absolute: 'Jiji - Deploy containers anywhere',
  },
  description: 'Deploy containerized apps across any Linux servers with zero-downtime rollouts, automatic HTTPS, and private WireGuard networking.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Jiji - Deploy containers anywhere',
    description: 'Production container deploys across servers you control. No agents, hosted platform, or cluster to babysit.',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jiji - Deploy containers anywhere',
    description: 'Production container deploys across servers you control. No agents, hosted platform, or cluster to babysit.',
    images: ['/twitter-image.png'],
  },
}

export default function HomePage() {
  return <LandingPage />
}
