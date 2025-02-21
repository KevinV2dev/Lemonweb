'use client';
import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { carouselData } from '@/app/carousel'; //Para mas Imagenes importar el Carousel.ts
import BarraDerecha from '@/app/components/ui/barraderecha';
import { Navbar } from '@/app/components/ui/navbar';
import BarraMovil from '@/app/components/ui/barramobile';
// Importaremos la barra móvil cuando la crees
// import BarraMobile from '@/app/components/ui/barramobile';

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Solo mantenemos la detección para la barra móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        className={`
          relative w-full  /* Cambiamos min-h-screen por h-screen */
          grid grid-cols-1 lg:grid-cols-[1fr_auto] 
          overflow-hidden
        `}
      >
        {/* Imagen de fondo - ajustamos para cubrir todo el ancho */}
        <div className="absolute inset-0 w-full -z-10">
          {/* Imagen móvil (default y < 640px) */}
          <Image
            src="/backgrounds/herobg.png"
            alt="Hero background"
            fill
            priority
            className="
              object-cover object-[40%_center]
              block sm:hidden
              w-full
            "
            sizes="100vw"
            quality={100}
            unoptimized={true}
          />

          {/* Imagen tablet (640px - 1024px) */}
          <Image
            src="/backgrounds/herobg.png"
            alt="Hero background"
            fill
            priority
            className="
              object-cover object-[23%_center]
              hidden sm:block lg:hidden
            "
            sizes="(min-width: 640px) and (max-width: 1024px) 100vw"
            quality={100}
            unoptimized={true}
          />

          {/* Imagen desktop (≥ 1024px) */}
          <Image
            src="/backgrounds/herobg.png"
            alt="Hero background"
            fill
            priority
            className="
              object-cover object-[0%_center]
              hidden lg:block
            "
            sizes="(min-width: 1024px) 100vw"
            quality={100}
            unoptimized={true}
          />
        </div>

        {/* Navbar integrada en el hero */}
        <div className="absolute top-0 left-0 w-full z-20">
          <Navbar />
        </div>

        {/* Contenido principal */}
        <div className="
          flex flex-col justify-center
          px-4 sm:px-[82px]
          pt-[88px] sm:pt-[100px]
          pb-[120px] sm:pb-[200px] lg:pb-[300px] 2xl:pb-[0px]
          relative z-10
          w-full
          h-full
        ">
          <div className="flex gap-8 flex-col">
            {/* Carrusel */}
            <div className="
              relative overflow-hidden z-0
              w-[337px] h-[200px]                    
              sm:w-[504px] sm:h-[336px]              
              lg:w-[520px] lg:h-[334px]              
            ">
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

            {/* Botón */}
            <button 
              onClick={() => router.push('/appointment')}  
              className='bg-[#1D1C19] text-[#fff] px-6 py-[10px] flex items-center gap-2 w-fit'
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

            {/* Texto */}
            <div className="flex flex-col lg:order-first">
              <h1 className="text-[#1D1C19] text-[32px] font-bold">
                Fresh spaces, clear minds.
              </h1>

              <div className="flex flex-col mt-4">
                <span>
                  Get a personalized solution to your spaces <br/> 
                  create unique pieces for you and your home.
                </span>
                <br/>
                <span>Deal with professionals who care.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barras laterales - ajustamos posición */}
        <div className="
          relative shrink flex items-center justify-center
          lg:static fixed 
          bottom-[50px] sm:bottom-[200px]
          left-0 right-0 
          w-full max-w-full
          px-4 sm:px-[50px]
        ">
          {/* Barra móvil - visible en móvil y tablet */}
          <div className="block lg:hidden w-full">
            <BarraMovil />
          </div>

          {/* Barra escritorio - visible solo en desktop */}
          <div className="hidden lg:block">
            <BarraDerecha />
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
