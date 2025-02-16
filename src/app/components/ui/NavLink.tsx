// components/ui/NavLink/NavLink.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isExact?: boolean;
}

export const NavLink = ({ href, children, isExact }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = isExact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`text-[#1D1C19] px-6 py-[6px] font-medium transition-colors ${
        isActive
          ? 'text-[#000] border-b-2 border-[#000]'
          : 'text-gray-500 hover:text-[#000] hover:border-b-2 hover:border-[#000]'
      }`}
    >
      {children}
    </Link>
  );
};