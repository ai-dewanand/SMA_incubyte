import type { Metadata } from 'next'
import { AppNav } from '../components/layout/AppNav'
import './globals.css'

export const metadata: Metadata = {
  title: 'SMA Incubyte Salary Management',
  description: 'Salary management dashboard for HR managers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="app-shell">
          <header className="topbar">
            <div className="brand">
              <span>SMA Incubyte</span>
              <small>Salary management dashboard</small>
            </div>
            <AppNav />
          </header>
          <main id="main-content" className="content">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
