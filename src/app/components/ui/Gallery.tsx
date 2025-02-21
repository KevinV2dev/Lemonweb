import Image from 'next/image';
import { Parallax } from 'react-scroll-parallax';

interface GalleryImage {
  src: string;
  alt: string;
  hasParallax?: boolean;
}

interface GalleryProps {
  images: GalleryImage[];
}

export function Gallery({ images }: GalleryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {images.map((image, index) => (
        <div key={index} className="relative h-[420px] overflow-hidden">
          {image.hasParallax ? (
            <Parallax
              className="w-full h-[140%]"
              translateY={[-20, 20]}
              easing="easeInQuad"
              speed={-10}
            >
              <div className="relative w-full h-full scale-[1.2]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </Parallax>
          ) : (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>
      ))}
    </div>
  );
} 