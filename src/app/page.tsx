'use client';
import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { carouselData } from '@/app/carousel'; //Para mas Imagenes importar el Carousel.ts
import BarraDerecha from '@/app/components/ui/barraderecha';
import { Navbar } from '@/app/components/ui/navbar';
import BarraMovil from '@/app/components/ui/barramobile';
import { motion, AnimatePresence } from 'framer-motion';
import { Preloader } from '@/app/components/ui/preloader';
// Importaremos la barra móvil cuando la crees
// import BarraMobile from '@/app/components/ui/barramobile';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
  }),
  center: {
    x: 0,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
  })
};

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const router = useRouter();

  const staggerDelay = 0.15;
  const baseDelay = 0.2;

  const fadeInUp = {
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }
  };

  const fadeInRight = {
    initial: { x: -30, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }
  };

  const slideUp = {
    initial: { y: '100%' },
    animate: { y: 0 },
    transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setContentVisible(true), 200);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
    if (!isPaused) {
      const timer = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prevIndex) => 
          prevIndex === carouselData.images.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);

      return () => clearInterval(timer);
    }
  }, [isPaused]);

  const handlePrevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? carouselData.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === carouselData.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      <AnimatePresence mode="sync">
        {isLoading && <Preloader />}
      </AnimatePresence>
      <main className="flex flex-col">
        <section 
          className={`
            relative w-full min-h-screen
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
          <motion.div 
            className="absolute top-0 left-0 w-full z-20"
            initial={{ y: -100 }}
            animate={contentVisible ? { y: 0 } : { y: -100 }}
            transition={{ 
              duration: 1, 
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
          >
            <Navbar />
          </motion.div>

          {/* Contenido principal */}
          <div className="
            flex flex-col justify-center
            px-4 sm:px-[50px]
            pt-[120px] sm:pt-[140px]
            pb-[120px] sm:pb-[200px] lg:pb-[300px] 2xl:pb-[0px]
            relative z-10
            w-full
            h-full
          ">
            <div className="flex gap-4 flex-col max-w-[1440px]">
              {/* Texto - Ahora primero en el orden */}
              <motion.div 
                className="flex flex-col"
                initial={{ x: -30, opacity: 0 }}
                animate={contentVisible ? { x: 0, opacity: 1 } : { x: -30, opacity: 0 }}
                transition={{ 
                  duration: 1,
                  ease: [0.43, 0.13, 0.23, 0.96],
                  delay: staggerDelay 
                }}
              >
                <h1 className="
                  text-night-lemon
                  text-normal sm:text-5xl lg:text-[32px]
                  font-bold 
                  leading-tight
                  tracking-tight
                  max-w-2xl
                ">
                  Fresh spaces, clear minds.
                </h1>

                <motion.div 
                  className="flex flex-col mt-4 text-normal sm:normal text-night-lemon max-w-[550px]"
                  initial={{ x: -30, opacity: 0 }}
                  animate={contentVisible ? { x: 0, opacity: 1 } : { x: -30, opacity: 0 }}
                  transition={{ 
                    duration: 1,
                    ease: [0.43, 0.13, 0.23, 0.96],
                    delay: staggerDelay * 2 
                  }}
                >
                  <span>
                    Get a personalized solution to your spaces 
                    create unique pieces for you and your home. Deal with professionals who care.
                  </span>
                </motion.div>
              </motion.div>

              {/* Carrusel mejorado */}
              <motion.div 
                className="
                  relative overflow-hidden z-0
                  w-full max-w-[600px]
                  aspect-[3/2]
                "
                initial={{ x: -30, opacity: 0 }}
                animate={contentVisible ? { x: 0, opacity: 1 } : { x: -30, opacity: 0 }}
                transition={{ 
                  duration: 1,
                  ease: [0.43, 0.13, 0.23, 0.96],
                  delay: staggerDelay * 3 
                }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "tween", duration: 0.6, ease: [0.4, 0, 0.2, 1] }
                    }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
                        src={carouselData.images[currentIndex].src}
                        alt={carouselData.images[currentIndex].alt}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        priority={currentIndex === 0}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Indicadores */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {carouselData.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setDirection(index > currentIndex ? 1 : -1);
                        setCurrentIndex(index);
                      }}
                      className={`h-2 transition-all duration-300
                        ${index === currentIndex ? 'bg-white w-8' : 'bg-white/50 w-2'}
                      `}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Botón CTA */}
              <motion.button 
                onClick={() => router.push('/appointment')}  
                className="bg-night-lemon text-white px-6 py-[10px] flex items-center gap-2 group w-fit"
                initial={{ x: -30, opacity: 0 }}
                animate={contentVisible ? { x: 0, opacity: 1 } : { x: -30, opacity: 0 }}
                transition={{ 
                  duration: 1,
                  ease: [0.43, 0.13, 0.23, 0.96],
                  delay: staggerDelay * 4 
                }}
              >
                SET AN APPOINTMENT
                <span className="transform transition-transform duration-200 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">
                  <Image
                    src='/icons/Vector.svg'
                    width={14} 
                    height={14}
                    alt="Arrow right"
                  />
                </span>
              </motion.button>
            </div>
          </div>

          {/* Barras laterales - ajustamos posición */}
          <motion.div 
            className="
              relative shrink flex items-center justify-center
              lg:static fixed 
              bottom-[50px] sm:bottom-[200px]
              left-0 right-0 
              w-full max-w-full
              px-4 sm:px-[50px]
            "
            initial={{ y: 50, opacity: 0 }}
            animate={contentVisible ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ 
              duration: 1,
              ease: [0.43, 0.13, 0.23, 0.96],
              delay: staggerDelay * 5 
            }}
          >
            {/* Barra móvil - visible en móvil y tablet */}
            <div className="block lg:hidden w-full">
              <BarraMovil />
            </div>

            {/* Barra escritorio - visible solo en desktop */}
            <div className="hidden lg:block">
              <BarraDerecha />
            </div>
          </motion.div>
        </section>

        {/* Sección para contenido adicional */}
        <section className="min-h-screen bg-white">
          <div className="
            container mx-auto 
            px-4 sm:px-6 lg:px-8
            py-16 sm:py-24
          ">
            {/* Aquí irá el contenido adicional */}
            <h2 className="text-3xl font-bold text-gray-900">Contenido adicional</h2>
          </div>
        </section>
      </main>
    </>
  );
}
