// components/ui/NavLink/NavLink.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  isExact?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const NavLink = ({ href, isExact, className = '', children }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = isExact ? pathname === href : pathname?.startsWith(href);

  return (
    <Link 
      href={href}
      className={`${className} ${isActive ? 'border-b-2 border-[#1D1C19]' : ''}`}
    >
      {children}
    </Link>
  );
};