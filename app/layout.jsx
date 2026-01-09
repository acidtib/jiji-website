import { Head } from 'nextra/components'

export const metadata = {
  title: 'Jiji',
  description: 'Jiji Website',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        {children}
      </body>
    </html>
  )
}
