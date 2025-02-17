// components/ui/Navbar/Navbar.tsx
'use client';

import { NavLink } from '@/app/components/ui/NavLink';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
  const router = useRouter();

  const links = [
    { href: '/', label: 'HOME', exact: true },
    { href: '/catalog', label: 'CATALOG' },
    { href: '/about-us', label: 'ABOUT US' },
  ];

  return (
    <nav className="w-full bg-transparent">
      <div className="w-full py-6 px-[50px] items-center flex-row z-50 bg-transparent">
        <div className="flex w-full items-center gap-4 justify-between">
          {/* Logo o nombre del sitio */}
          <div className="flex items-center gap-4">
            <Image
              src='/icons/Group.svg'
              width={114} 
              height={24}
              alt="Lemon"
            />

            {/* Links de navegación */}           
            <div className="flex">
              {links.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  isExact={link.exact}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
          

          <div className='flex gap-4'>
            <button>
              <span>281-684-9852</span>
            </button>

            <button className='bg-[#1D1C19] text-[#fff] px-6 py-[10px] flex items-center gap-2'>
              BOOK A CALL
              <span>
                <Image
                  src='/icons/Vector.svg'
                  width={14} 
                  height={14}
                  alt="Lemon"
                />
              </span>
            </button>

            <button 
              onClick={() => router.push('/appointment')} 
              className='bg-[#1D1C19] text-[#fff] px-6 py-[10px] flex items-center gap-2'
            >
              SET AN APPOINTMENT
              <span>
                <Image
                  src='/icons/Vector.svg'
                  width={14} 
                  height={14}
                  alt="Lemon"
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};