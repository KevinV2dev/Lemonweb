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
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import Lenis from '@studio-freight/lenis';
import { Gallery } from '@/app/components/ui/Gallery';
import { galleryData } from '@/app/gallery-data';
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

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

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
    <ParallaxProvider>
      <AnimatePresence mode="sync">
        {isLoading && <Preloader />}
      </AnimatePresence>
      <main className="flex flex-col mb-24">
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

        {/* Sección de contenido adicional */}
        {/* Bloque 1: Texto Introductorio */}
        <section className="w-full min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
          {/* Gradientes base */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
                x: [0, -20, 0],
                y: [0, 20, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-yellow-lemon blur-[120px]"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.3, 0.2],
                x: [0, 20, 0],
                y: [0, -20, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-lime-lemon blur-[120px]"
            />
          </motion.div>

          {/* Gradiente reactivo al mouse */}
          <motion.div 
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              background: `radial-gradient(600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(254, 241, 104, 0.15), transparent 80%)`
            }}
          />

          {/* Event listener para el mouse */}
          <div
            className="absolute inset-0 z-[2]"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              document.documentElement.style.setProperty('--mouse-x', `${x}%`);
              document.documentElement.style.setProperty('--mouse-y', `${y}%`);
            }}
          />

          {/* Contenido */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center relative z-[3]">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 1,
                ease: [0.43, 0.13, 0.23, 0.96]
              }}
              className="space-y-6 select-none"
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-night-lemon">
                We create spaces for you, and only you.
              </h2>
              <p className="text-silver-lemon text-lg sm:text-xl max-w-2xl mx-auto">
                At Lemon, we have been evolving, we offer customized organizational solutions to 
                streamline living areas at your home, giving a purpose of order and style.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Bloque 2: Imagen + Texto */}
        <section className="w-full bg-night-lemon p-4">
          <div className="max-w-[1920px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-4 items-center">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/images/closets_de_melamina.jpg"
                  alt="Interior design"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-6 lg:pl-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  We create spaces for you, and only you.
                </h3>
                <p className="text-heaven-lemon max-w-[600px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                  nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bloque 3: Features */}
        <section className="w-full bg-white">
          <div className="max-w-[1920px] mx-auto h-[244px] px-32 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 w-full h-full">
              {/* Feature 1 */}
              <div className="flex flex-col items-start p-4">
                <div className="mb-4">
                  <Image
                    src="/icons/custom-design.svg"
                    alt="Custom design"
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-night-lemon">Custom design</h4>
                  <p className="text-silver-lemon mt-2">Cada espacio es único, fabricamos específicamente para ti</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-start p-4">
                <div className="mb-4">
                  <Image
                    src="/icons/quality.svg"
                    alt="High quality"
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-night-lemon">High quality materials</h4>
                  <p className="text-silver-lemon mt-2">Durabilidad y estética en los más finos acabados</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-start p-4">
                <div className="mb-4">
                  <Image
                    src="/icons/sustainability.svg"
                    alt="Sustainability"
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-night-lemon">Sustainability</h4>
                  <p className="text-silver-lemon mt-2">Productos sustentables y responsables con el ambiente</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col items-start p-4">
                <div className="mb-4">
                  <Image
                    src="/icons/fast-delivery.svg"
                    alt="Fast delivery"
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-night-lemon">Fast delivery</h4>
                  <p className="text-silver-lemon mt-2">Instalación eficiente y en los tiempos acordados</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bloque 4: Imagen Full Width con Parallax */}
        <section className="w-full h-[600px] relative overflow-hidden">
          <Parallax
            className="w-full h-full"
            translateY={[-20, 90]}
            easing="easeInQuad"
            speed={-10}
          >
            <Image
              src="/images/closet2.jpg"
              alt="Lemon lifestyle"
              fill
              className="object-cover"
              priority
              quality={90}
              sizes="100vw"
            />
          </Parallax>
        </section>

        {/* Bloque 5: Our Story */}
        <section className="w-full py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-night-lemon mb-6">
              Our story
            </h2>
            <p className="text-silver-lemon text-lg">
              Lemon nació como respuesta a la necesidad actual de optimizar el espacio sin sacrificar el estilo. 
              En un época donde cada vez más personas trabajan desde casa, entendemos la importancia de crear 
              espacios funcionales, elegantes y perfectamente adaptados a las necesidades de nuestros clientes.
            </p>
          </div>
        </section>

        {/* Bloque 6: Proceso */}
        <section className="w-full bg-white p-4">
          <div className="max-w-[1920px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-12 items-center">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Parallax
                  className="w-full h-full"
                  translateY={[-30, 60]}
                  easing="easeInQuad"
                  speed={-50}
                >
                  <Image
                    src="/images/Closet1.webp"
                    alt="Our process"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                    sizes="100vw"
                  />
                </Parallax>
              </div>
              <div className="space-y-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-night-lemon">
                  The process
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-night-lemon">Consulta personalizada</h4>
                    <p className="text-silver-lemon">Analizamos tu espacio y necesidades</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-night-lemon">Diseño a medida</h4>
                    <p className="text-silver-lemon">Creamos una solución adaptada a tu hogar</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-night-lemon">Fabricación de calidad</h4>
                    <p className="text-silver-lemon">Proceso de producción con materiales de primera categoría</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-night-lemon">Instalación</h4>
                    <p className="text-silver-lemon">Instalamos y organizamos tu espacio de forma eficiente</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-night-lemon">Disfruta tu nuevo espacio</h4>
                    <p className="text-silver-lemon">Vive el armario con un diseño optimizado para tu estilo de vida</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bloque 7: CTA */}
        <section className="w-full py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-night-lemon text-xl mb-4">
              ¿Quieres renovar tu hogar? Explora nuestro{" "}
              <button 
                onClick={() => router.push('/catalog')}
                className="text-night-lemon font-semibold underline hover:text-night-lemon/80"
              >
                catálogo
              </button>{" "}
              o{" "}
              <button
                onClick={() => router.push('/appointment')}
                className="text-night-lemon font-semibold underline hover:text-night-lemon/80"
              >
                agenda una cita
              </button>
            </p>
          </div>
        </section>

        {/* Bloque 8: Galería */}
        <section className="w-full bg-white">
          <div className="px-4">
            <Gallery images={galleryData.images} />
          </div>
        </section>
      </main>
    </ParallaxProvider>
  );
}
