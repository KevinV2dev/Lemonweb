// components/ui/Navbar/Navbar.tsx
'use client';

import { NavLink } from '@/app/components/ui/NavLink';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home', exact: true },
    { href: '/catalog', label: 'Catalog' },
    { href: '/about-us', label: 'About us' },
  ];

  return (
    <nav className="w-full bg-transparent relative z-50">
      <div className="w-full py-6 px-[50px] items-center flex-row bg-transparent">
        <div className="flex w-full items-center gap-4 justify-between">
          {/* Logo y navegación agrupados */}
          <div className="flex items-center">
            <div>
              <Image
                src='/icons/Group.svg'
                width={114} 
                height={24}
                alt="Lemon"
              />
            </div>

            {/* Links de navegación para desktop con gap de 8px y ml-8 (32px) */}           
            <div className="hidden lg:flex items-center ml-8 space-x-2">
              {links.map((link) => (
                <motion.div
                  key={link.href}
                  whileTap={{ scale: 0.95 }}
                  className="overflow-hidden"
                >
                  <NavLink
                    href={link.href}
                    isExact={link.exact}
                    className="block px-6 py-[6px] font-medium relative group"
                  >
                    <span className="relative z-10 text-[#1D1C19]">
                      {link.label}
                    </span>
                    <span className="absolute inset-0 bg-night-lemon transform translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-[calc(100%-5px)]" />
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Botones para desktop */}
          <div className='hidden lg:flex items-center gap-4'>
            <button className="text-night-lemon font-medium flex items-center gap-2 group">
              <span className="group-hover:animate-phone-ring inline-block">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-4 h-4 fill-current"
                >
                  <path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z"/>
                  <path d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 0 0-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 0 0 .043-1.391L6.859 3.513a1 1 0 0 0-1.391-.087l-2.17 1.861a1 1 0 0 0-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 0 0 .648-.291l1.86-2.171a1 1 0 0 0-.086-1.391l-4.064-3.696z"/>
                </svg>
              </span>
              <span>281-684-9852</span>
            </button>

            <button 
              className='bg-night-lemon text-white px-6 py-[10px] flex items-center gap-2 group'
            >
              BOOK A CALL
              <span className="transform transition-transform duration-200 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">
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
              className='bg-night-lemon text-white px-6 py-[10px] flex items-center gap-2 group'
            >
              SET AN APPOINTMENT
              <span className="transform transition-transform duration-200 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">
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
          <motion.button 
            whileTap={{ scale: 0.95 }}
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
          </motion.button>
        </div>

        {/* Menú móvil desplegable */}
        <motion.div 
          className={`
            fixed top-0 right-0 h-screen w-[200px]
            bg-night-lemon
            transform transition-all duration-300 ease-in-out
            ${isMenuOpen 
              ? 'translate-x-0' 
              : 'translate-x-full'
            }
            block lg:hidden
          `}
          initial={false}
          animate={isMenuOpen ? { x: 0 } : { x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex flex-col items-start justify-center h-full gap-8 px-8">
            {links.map((link) => (
              <motion.div
                key={link.href}
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                <NavLink
                  href={link.href}
                  isExact={link.exact}
                  className="text-white text-lg font-medium transition-colors duration-300 hover:text-yellow-lemon border-b-2 border-transparent"
                >
                  <span>
                    {link.label}
                  </span>
                </NavLink>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </nav>
  );
};