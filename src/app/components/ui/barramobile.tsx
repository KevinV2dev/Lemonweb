import React, { useState } from 'react'
import Image from 'next/image'

function barramobile() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className='flex flex-col px-[16px] gap-4 relative z-50'>
      <div className='flex flex-row gap-4'>
        <a href="https://wa.me/+2816849852" target='_Blank' className="bg-black p-2 transition-colors group">
          <Image 
            src="/icons/WhatsApp.svg" 
            alt="WhatsApp" 
            width={21} 
            height={20}
            className="transition-colors group-hover:filter group-hover:brightness-0 group-hover:invert-[.65] group-hover:sepia-[.85] group-hover:saturate-[1000%] group-hover:hue-rotate-[5deg]"
          />
        </a>
        <a href="#" className="bg-black p-2 transition-colors group">
          <Image 
            src="/icons/email.svg" 
            alt="Email" 
            width={21} 
            height={20}
            className="transition-colors group-hover:filter group-hover:brightness-0 group-hover:invert-[.65] group-hover:sepia-[.85] group-hover:saturate-[1000%] group-hover:hue-rotate-[5deg]"
          />
        </a>
        <a href="https://www.instagram.com/" target='_Blank' className="bg-black p-2 transition-colors group">
          <Image 
            src="/icons/instagram.svg" 
            alt="Instagram" 
            width={21} 
            height={20}
            className="transition-colors group-hover:filter group-hover:brightness-0 group-hover:invert-[.65] group-hover:sepia-[.85] group-hover:saturate-[1000%] group-hover:hue-rotate-[5deg]"
          />
        </a>
      </div>

      <div 
        className="relative group"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className={`
          fixed bottom-[38px] left-[16px] right-[16px]
          bg-[#1D1C19]
          transform transition-all duration-300 ease-in-out
          ${isExpanded 
            ? 'h-[572px] opacity-100 pointer-events-auto' 
            : 'h-0 opacity-0 pointer-events-none'
          }
        `}>
          <div className="p-8 text-white">
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

        <div className="bg-[#1D1C19] h-[38px] cursor-pointer relative">
          <div className='flex flex-row justify-between w-full py-[6px] px-[16px]'>
            <div>
              <span className='text-white text-[16px]'>Fresh spaces, productive minds</span>
            </div>
            <div>
              <Image 
                src="/icons/group 1.svg" 
                alt="Lemon" 
                width={21} 
                height={20}
                className="mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default barramobile
