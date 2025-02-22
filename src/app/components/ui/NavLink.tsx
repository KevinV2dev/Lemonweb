// components/ui/NavLink/NavLink.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  isExact?: boolean;
  onClick?: () => void;
}

export const NavLink = ({ href, children, className = '', isExact = false, onClick }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = isExact ? pathname === href : pathname.startsWith(href);

  return (
    <Link 
      href={href}
      className={`${className} ${isActive ? 'border-b-2 border-[#1D1C19]' : ''}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};