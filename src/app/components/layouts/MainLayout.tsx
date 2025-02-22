'use client'

import { Navbar } from '../ui/navbar'
import { usePathname } from 'next/navigation'
import { ContactFooter } from '../ui/footer/contact-footer'

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')
  const isHome = pathname === '/'
  const isCatalogHome = pathname === '/catalog'
  const shouldShowFooter = isHome || pathname?.startsWith('/catalog')

  return (
    <div className="min-h-screen flex flex-col relative">
      {!isAdminRoute && !isHome && !isCatalogHome && (
        <header className="w-full bg-white fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </header>
      )}
      <main className={`flex-1 ${!isHome && !isAdminRoute ? '' : ''}`}>
        {children}
      </main>
      {shouldShowFooter && <ContactFooter />}
    </div>
  )
}

export default MainLayout