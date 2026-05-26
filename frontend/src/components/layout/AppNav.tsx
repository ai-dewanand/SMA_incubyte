'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/employees', label: 'Employees' },
  { href: '/insights', label: 'Insights' },
]

export function AppNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="nav" aria-label="Main navigation">
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? 'Close menu' : 'Menu'}
      </button>
      <div id="primary-nav" className={`nav-links${open ? ' nav-links-open' : ''}`}>
        {links.map((link) => {
          const active = pathname === link.href
          return (
            <a
              key={link.href}
              href={link.href}
              className={active ? 'nav-link-active' : undefined}
              aria-current={active ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          )
        })}
      </div>
    </nav>
  )
}
