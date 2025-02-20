import React, { useState } from 'react'
import Image from 'next/image'

export default function barraderecha() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="h-full flex flex-col justify-center gap-[30px]"> 
      {/* Barra principal */}
      <div 
        className={`
          relative bg-black h-[572px] transition-all duration-300 cursor-pointer
          ${isExpanded ? 'w-[383px]' : 'w-8'}
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Barra con logo y texto */}
        <div className={`
          absolute h-full flex flex-col justify-between py-6 z-10 w-8
          ${isExpanded ? 'left-0' : 'right-0'}
          transition-all duration-300
        `}>
          {/* Logo */}
          <Image 
            src="/icons/group 1.svg" 
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
        <div className={`
          absolute left-8 right-0 p-8 pl-12 text-white h-full flex flex-col justify-center
          transition-all duration-300
          ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Welcome to Lemon</h3>
            <p className="text-sm text-gray-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </div>

      {/* Iconos sociales */}
      <div className="flex flex-col gap-4 items-end">
        <a href="https://wa.me/+2816849852" target='_Blank' className="bg-black p-2 hover:bg-gray-900 transition-colors">
          <Image 
            src="/icons/WhatsApp.svg" 
            alt="WhatsApp" 
            width={21} 
            height={20}
          />
        </a>
        <a href="#" className="bg-black p-2 hover:bg-gray-900 transition-colors">
          <Image 
            src="/icons/email.svg" 
            alt="Email" 
            width={21} 
            height={20}
          />
        </a>
        <a href="https://www.instagram.com/" target='_Blank' className="bg-black p-2 hover:bg-gray-900 transition-colors">
          <Image 
            src="/icons/instagram.svg" 
            alt="Instagram" 
            width={21} 
            height={20}
          />
        </a>
      </div>
    </div>
  )
}
