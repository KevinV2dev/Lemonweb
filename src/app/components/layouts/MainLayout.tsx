'use client'

import { Navbar } from '../ui/navbar'
import { usePathname } from 'next/navigation'

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')
  const isHome = pathname === '/'

  return (
    <div className="min-h-screen flex flex-col relative">
      {!isAdminRoute && !isHome && (
        <header className="w-full bg-white">
          <Navbar />
        </header>
      )}
      <main className={`flex-1 ${!isHome && !isAdminRoute ? '' : ''}`}>
        {children}
      </main>
    </div>
  )
}

export default MainLayout