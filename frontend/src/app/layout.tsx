import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SMA Incubyte Salary Management',
  description: 'Salary management dashboard for HR managers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
