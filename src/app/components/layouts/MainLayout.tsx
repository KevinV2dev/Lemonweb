'use client'

import { Navbar } from '../ui/navbar'
import { usePathname } from 'next/navigation'

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <header className={`absolute w-full ${isAdminRoute ? 'hidden' : ''}`}>
        <Navbar />
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}

export default MainLayout