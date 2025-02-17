'use client';
import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { carouselData } from '@/app/carousel'; //Para mas Imagenes importar el Carousel.ts

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === carouselData.images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="flex flex-col">
      <section 
        className="h-screen bg-cover bg-no-repeat flex items-center"
        style={{
          backgroundImage: 'url("/backgrounds/HERO.png")',
          backgroundPosition: 'left',
        }}
      >
          {/* Barra lateral derecha */}
        <div className="absolute right-0 top-0 bg-black h-[572px] w-8 mr-[50px] mt-[124px]">
          <div className="h-full flex flex-col justify-between items-center py-6">
            <Image 
              src="/icons/group 1.svg" 
              alt="Lemon" 
              width={21} 
              height={20}
            />
            <span className="-rotate-90 text-white text-sm text-nowrap transform translate-y-[-90px]">
              Fresh spaces, productive minds
            </span>
          </div>
        </div>

       <div className="container flex flex-col gap-4 ml-[82px] ">
        <div> <h1 className="text-[#1D1C19] text-[48px] font-bold">Fresh spaces, clear minds.</h1> </div>

        <div>
          <span>Get a personalized solution to your spaces, create unique pieces for you and your home.</span>
          <span>Deal with professionals who care.</span>
        </div>

        <div>
        <button onClick={() => router.push('/appointment')}  className='bg-[#1D1C19] text-[#fff] px-6 py-[10px] flex items-center gap-2'>
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
        <div className="relative w-[562px] h-[334px] overflow-hidden">
          {carouselData.images.map((image, index) => (
            <div
              key={image.id}
              className={`absolute w-full h-full transition-opacity duration-1000 ease-in-out
                ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

       </div>
      </section>

      {/* Sección para contenido adicional */}
      <section className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          {/* Aquí irá el contenido adicional */}
          <h2>Contenido adicional</h2>
        </div>
      </section>
    </main>
  );
}
