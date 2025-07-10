import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MVC P&D',
  description: 'MVC Proyecto & Diseño Ltda.',
  generator: 'MVC P&D',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
