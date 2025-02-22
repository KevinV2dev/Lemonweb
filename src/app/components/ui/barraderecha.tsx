import React, { useState } from 'react'
import Image from 'next/image'

export default function barraDerecha() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="hidden sm:flex flex-col gap-8"> 
      {/* Barra principal */}
      <div 
        className="
          relative
          h-[572px]
          cursor-pointer
        "
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => window.innerWidth >= 1024 && setIsExpanded(true)}
        onMouseLeave={() => window.innerWidth >= 1024 && setIsExpanded(false)}
      >
        {/* Contenedor principal con animación */}
        <div 
          className={`
            absolute
            right-0
            bg-night-lemon
            overflow-hidden
            will-change-transform
            transition-all duration-700 ease-out
            ${isExpanded 
              ? 'w-[383px] h-full' 
              : 'w-8 h-full'
            }
          `}
        >
          {/* Barra con logo y texto */}
          <div className={`
            absolute
            h-full w-8
            flex flex-col
            items-stretch
            py-6
            z-10
            ${isExpanded ? 'left-0' : 'right-0'}
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
            <span className="
              text-white select-none text-sm whitespace-nowrap
              absolute bottom-24 left-1/2
              -rotate-90 origin-center
              -translate-x-1/2
            ">
              Fresh spaces, productive minds
            </span>
          </div>

          {/* Contenido expandible */}
          <div 
            className={`
              absolute
              top-0 left-8
              w-[320px]
              px-8
              text-white
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
              <p className="text-sm text-gray-300">
                Experience the perfect blend of functionality and aesthetics with our custom storage solutions. 
                Our expert team specializes in creating personalized spaces that maximize your storage 
                capacity while enhancing your home's beauty.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Iconos sociales */}
      <div className="flex flex-col gap-4 items-end">
        <a 
          href="https://wa.me/+2816849852" 
          target='_Blank' 
          className="
            bg-night-lemon
            w-8 h-8
            flex justify-center items-center
            transition-colors
            group
          "
        >
          <Image 
            src="/icons/ws.svg" 
            alt="WhatsApp" 
            width={16} 
            height={16}
            className="transition-colors group-hover:filter group-hover:brightness-0 group-hover:invert-[.65] group-hover:sepia-[.85] group-hover:saturate-[1000%] group-hover:hue-rotate-[5deg]"
          />
        </a>
        <a 
          href="#" 
          className="
            bg-night-lemon
            w-8 h-8
            flex justify-center items-center
            transition-colors
            group
          "
        >
          <Image 
            src="/icons/email.svg" 
            alt="Email" 
            width={16} 
            height={16}
            className="transition-colors group-hover:filter group-hover:brightness-0 group-hover:invert-[.65] group-hover:sepia-[.85] group-hover:saturate-[1000%] group-hover:hue-rotate-[5deg]"
          />
        </a>
        <a 
          href="https://www.instagram.com/" 
          target='_Blank' 
          className="
            bg-night-lemon
            w-8 h-8
            flex justify-center items-center
            transition-colors
            group
          "
        >
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
