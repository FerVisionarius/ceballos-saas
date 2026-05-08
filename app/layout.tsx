import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'


const inter = Inter({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'Inmobiliaria Ceballos',
  description: 'Plataforma de gestión interna',
  icons: {
    icon: '/logo.png',
  },
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
