import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SMA Incubyte Salary Management',
  description: 'Salary management dashboard for HR managers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <div className="brand">
              <span>SMA Incubyte</span>
              <small>Salary management dashboard</small>
            </div>
            <nav className="nav-links">
              <a href="/">Home</a>
              <a href="/employees">Employees</a>
              <a href="/insights">Insights</a>
            </nav>
          </header>
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  )
}
