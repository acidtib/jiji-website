import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: 'Jiji Documentation',
  description: 'Documentation for Jiji',
}

const banner = <Banner storageKey="jiji-banner">Welcome to Jiji Docs!</Banner>
const navbar = (
  <Navbar logo={<b>Jiji Docs</b>} />
)
const footer = <Footer>MIT {new Date().getFullYear()} Jiji.</Footer>

export default async function DocsLayout({ children }) {
  return (
    <Layout
      // banner={banner}
      navbar={navbar}
      pageMap={await getPageMap()}
      docsRepositoryBase="https://github.com/acitib/jiji-website"
      footer={footer}
    >
      {children}
    </Layout>
  )
}
