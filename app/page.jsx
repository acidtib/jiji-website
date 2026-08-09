import LandingPage from '@/components/LandingPage'

const title = 'Jiji: Open-Source Container Deployment for Linux Servers'
const description = 'Deploy Docker and Podman containers across Linux servers with zero-downtime rollouts, automatic HTTPS, and private WireGuard networking.'

export const metadata = {
  title: {
    absolute: title,
  },
  description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title,
    description,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/twitter-image.png'],
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://jiji.run/#website',
      url: 'https://jiji.run/',
      name: 'Jiji',
      description,
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://jiji.run/#software',
      name: 'Jiji',
      url: 'https://jiji.run/',
      description,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Linux, macOS',
      softwareRequirements: 'Linux deployment servers with Docker or Podman and SSH access',
      license: 'https://github.com/acidtib/jiji/blob/main/LICENSE',
      downloadUrl: 'https://get.jiji.run/install.sh',
      sameAs: ['https://github.com/acidtib/jiji'],
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <LandingPage />
    </>
  )
}
