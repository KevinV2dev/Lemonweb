// components/ui/Navbar/Navbar.tsx
'use client';

import { NavLink } from '@/app/components/ui/NavLink';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  alwaysShowBackground?: boolean;
}

export const Navbar = ({ alwaysShowBackground = false }: NavbarProps) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const links = [
    { href: '/', label: 'Home', exact: true },
    { href: '/catalog', label: 'Catalog' },
  ];

  const socialLinks = [
    { href: 'https://wa.me/+2816849852', icon: '/icons/ws.svg', label: 'WhatsApp' },
    { href: '#', icon: '/icons/email.svg', label: 'Email' },
    { href: 'https://www.instagram.com/', icon: '/icons/instagram.svg', label: 'Instagram' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className={`
        absolute inset-0 bg-white
        transition-transform duration-500 ease-in-out origin-top
        ${alwaysShowBackground ? 'scale-y-100' : hasScrolled ? 'scale-y-100' : 'scale-y-0'}
      `} />
      <div className="w-full px-6 py-8 items-center flex-row relative">
        <div className="flex w-full items-center gap-2 sm:gap-4 justify-between">
          {/* Logo y navegación agrupados */}
          <div className="flex items-center">
            <div>
              <Image
                src='/icons/Group.svg'
                width={114} 
                height={24}
                alt="Lemon"
                className="w-[90px] sm:w-[114px]"
              />
            </div>

            {/* Links de navegación para desktop */}           
            <div className="hidden [@media(min-width:1120px)]:flex items-center ml-8 space-x-2">
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
          <div className='hidden [@media(min-width:1120px)]:flex items-center gap-4'>
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

          {/* Botón de menú hamburguesa para móvil */}
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="block [@media(min-width:1120px)]:hidden z-50 relative"
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
                  <span className="absolute w-6 h-0.5 bg-black transform rotate-45 top-1/2 -translate-y-1/2 mr-2"></span>
                  <span className="absolute w-6 h-0.5 bg-black transform -rotate-45 top-1/2 -translate-y-1/2 mr-2"></span>
                </span>
              </div>
            )}
          </motion.button>
        </div>

        {/* Menú móvil moderno */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Overlay con blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 [@media(min-width:1120px)]:hidden"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Panel lateral */}
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 h-screen w-[85vw] max-w-[400px] bg-white shadow-xl z-40 [@media(min-width:1120px)]:hidden"
              >
                <div className="h-full flex flex-col">
                  {/* Contenido del menú */}
                  <div className="flex-1 overflow-y-auto px-6 py-20">
                    {/* Links de navegación */}
                    <div className="space-y-6 mb-12">
                      {links.map((link) => (
                        <motion.div
                          key={link.href}
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          <NavLink
                            href={link.href}
                            isExact={link.exact}
                            className="block text-2xl font-medium text-night-lemon hover:text-night-lemon/80 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {link.label}
                          </NavLink>
                        </motion.div>
                      ))}
                    </div>

                    {/* Botones de acción */}
                    <div className="space-y-4 mb-12">
                      <motion.button
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
                        className="w-full bg-night-lemon text-white px-6 py-3 flex items-center justify-center gap-2 group"
                        onClick={() => {
                          router.push('/appointment');
                          setIsMenuOpen(false);
                        }}
                      >
                        SET AN APPOINTMENT
                        <span className="transform transition-transform duration-200 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">
                          <Image
                            src='/icons/Vector.svg'
                            width={14} 
                            height={14}
                            alt="Arrow"
                          />
                        </span>
                      </motion.button>

                      <motion.button
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
                        className="w-full bg-night-lemon text-white px-6 py-3 flex items-center justify-center gap-2 group"
                      >
                        BOOK A CALL
                        <span className="transform transition-transform duration-200 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">
                          <Image
                            src='/icons/Vector.svg'
                            width={14} 
                            height={14}
                            alt="Arrow"
                          />
                        </span>
                      </motion.button>

                      <motion.a
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.3 }}
                        href="tel:+2816849852"
                        className="w-full bg-night-lemon text-white px-6 py-3 flex items-center justify-center gap-2 group"
                      >
                        <span className="group-hover:animate-phone-ring">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                            <path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z"/>
                            <path d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 0 0-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 0 0 .043-1.391L6.859 3.513a1 1 0 0 0-1.391-.087l-2.17 1.861a1 1 0 0 0-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 0 0 .648-.291l1.86-2.171a1 1 0 0 0-.086-1.391l-4.064-3.696z"/>
                          </svg>
                        </span>
                        281-684-9852
                      </motion.a>
                    </div>

                    {/* Redes sociales */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex justify-center gap-4"
                    >
                      {socialLinks.map((link, index) => (
                        <motion.a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-night-lemon w-12 h-12 rounded-full flex items-center justify-center group transition-transform hover:scale-110"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          <Image
                            src={link.icon}
                            alt={link.label}
                            width={20}
                            height={20}
                            className="transition-colors group-hover:filter group-hover:brightness-0 group-hover:invert-[.65] group-hover:sepia-[.85] group-hover:saturate-[1000%] group-hover:hue-rotate-[5deg]"
                          />
                        </motion.a>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};