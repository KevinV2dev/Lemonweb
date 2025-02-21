declare module 'react-scroll-parallax' {
  import { ReactNode } from 'react';

  interface ParallaxProps {
    children: ReactNode;
    className?: string;
    translateY?: [number, number];
    easing?: string;
    speed?: number;
  }

  interface ParallaxProviderProps {
    children: ReactNode;
    debug?: boolean;
  }

  export const Parallax: React.FC<ParallaxProps>;
  export const ParallaxProvider: React.FC<ParallaxProviderProps>;
} 