import Image from "next/image";

export default function Home() {
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
