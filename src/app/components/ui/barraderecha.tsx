import React, { useState } from 'react'
import Image from 'next/image'

export default function barraderecha() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="h-full flex flex-col justify-center gap-[30px]"> 
      {/* Barra principal */}
      <div 
        className="relative h-[572px] cursor-pointer"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Contenedor principal con animación */}
        <div 
          className={`
            absolute top-0 right-0 h-full
            bg-night-lemon overflow-hidden
            will-change-transform
            transition-all duration-700 ease-out
            ${isExpanded ? 'w-[383px]' : 'w-8'}
          `}
        >
          {/* Barra con logo y texto */}
          <div className={`
            absolute h-full w-8 flex flex-col justify-between py-6 z-10
            ${isExpanded ? 'left-0' : 'right-0'}
            will-change-transform
            transition-all duration-700 ease-out
          `}>
            {/* Logo */}
            <Image 
              src="/icons/simbolo.svg" 
              alt="Lemon" 
              width={21} 
              height={20}
              className="mx-auto"
            />
            
            {/* Texto vertical */}
            <div className="flex justify-center mb-20">
              <span className="text-white select-none text-sm whitespace-nowrap transform -rotate-90 origin-center inline-block">
                Fresh spaces, productive minds
              </span>
            </div>
          </div>

          {/* Contenido expandible */}
          <div 
            className={`
              absolute left-8 w-[320px] p-8 pl-12 text-white h-full
              flex flex-col justify-center
              transform
              will-change-transform will-change-opacity
              transition-all duration-800 ease-out
              ${isExpanded 
                ? 'translate-x-0 opacity-100' 
                : 'translate-x-[100px] opacity-0 pointer-events-none'
              }
            `}
          >
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Welcome to Lemon</h3>
              <p className="text-sm text-gray-300 whitespace-pre-line">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Iconos sociales */}
      <div className="flex flex-col gap-4 items-end">
        <a href="https://wa.me/+2816849852" target='_Blank' className="bg-night-lemon w-[32px] h-[32px] flex justify-center items-center transition-colors group">
          <Image 
            src="/icons/ws.svg" 
            alt="WhatsApp" 
            width={16} 
            height={16}
            className="transition-colors group-hover:filter group-hover:brightness-0 group-hover:invert-[.65] group-hover:sepia-[.85] group-hover:saturate-[1000%] group-hover:hue-rotate-[5deg]"
          />
        </a>
        <a href="#" className="bg-night-lemon w-[32px] h-[32px] flex justify-center items-center transition-colors group">
          <Image 
            src="/icons/email.svg" 
            alt="Email" 
            width={16} 
            height={16}
            className="transition-colors group-hover:filter group-hover:brightness-0 group-hover:invert-[.65] group-hover:sepia-[.85] group-hover:saturate-[1000%] group-hover:hue-rotate-[5deg]"
          />
        </a>
        <a href="https://www.instagram.com/" target='_Blank' className="bg-night-lemon w-[32px] h-[32px] flex justify-center items-center transition-colors group">
          <Image 
            src="/icons/instagram.svg" 
            alt="Instagram" 
            width={16} 
            height={16}
            className="transition-colors group-hover:filter group-hover:brightness-0 group-hover:invert-[.65] group-hover:sepia-[.85] group-hover:saturate-[1000%] group-hover:hue-rotate-[5deg]"
          />
        </a>
      </div>
    </div>
  )
}
