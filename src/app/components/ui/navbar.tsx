// components/ui/Navbar/Navbar.tsx
'use client';

import { NavLink } from '@/app/components/ui/NavLink';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: '/', label: 'HOME', exact: true },
    { href: '/catalog', label: 'CATALOG' },
    { href: '/about-us', label: 'ABOUT US' },
  ];

  return (
    <nav className="w-full bg-transparent relative z-50">
      <div className="w-full py-6 px-[50px] items-center flex-row bg-transparent">
        <div className="flex w-full items-center gap-4 justify-between">
          {/* Logo y navegación agrupados */}
          <div className="flex items-center gap-8">
            <div>
            <Image
              src='/icons/Group.svg'
              width={114} 
              height={24}
              alt="Lemon"
            />
            </div>

            {/* Links de navegación para desktop */}           
            <div className="hidden lg:flex items-center gap-8">
              {links.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  isExact={link.exact}
                  className="text-[#1D1C19] px-6 py-[6px] font-medium transition-colors hover:text-black hover:border-b-2 hover:border-[#1D1C19]"
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Botones para desktop */}
          <div className='hidden lg:flex items-center gap-4'>
            <button className="text-[#1D1C19] font-medium">
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

          {/* Botón de menú hamburguesa solo para móvil y tablet */}
          <button 
            className="block lg:hidden z-50 relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {!isMenuOpen ? (
              <Image
                src='/icons/menu.svg'
                width={24} 
                height={24}
                alt="Menu"
              />
            ) : (
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="block relative w-6 h-6 text-black">
                  <span className="absolute w-6 h-0.5 bg-black transform rotate-45 top-1/2 -translate-y-1/2"></span>
                  <span className="absolute w-6 h-0.5 bg-black transform -rotate-45 top-1/2 -translate-y-1/2"></span>
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Menú móvil desplegable */}
        <div className={`
          fixed top-0 right-0 h-screen w-[200px]
          bg-[#1D1C19]
          transform transition-all duration-300 ease-in-out
          ${isMenuOpen 
            ? 'translate-x-0' 
            : 'translate-x-full'
          }
          block lg:hidden
        `}>
          <div className="flex flex-col items-start justify-center h-full gap-8 px-8">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                isExact={link.exact}
                className="text-white text-lg font-medium transition-colors hover:text-[#FEF168] border-b-2 border-transparent"
              >
                <span>
                  {link.label}
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};