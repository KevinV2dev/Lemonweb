import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Image src="/ejemplo.jpg" alt="ejemplo" width={100} height={100} />
      <span>hola</span>
      <span>hola</span>
      <span>hola</span>
    </div>
  );
}
