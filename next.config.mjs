import nextra from 'nextra'

const withNextra = nextra({
})

export default withNextra({
  reactStrictMode: true,
  output: 'export',
  basePath: '/jiji-website',
  images: {
    unoptimized: true,
  },
})
