import { motion } from 'framer-motion';
import Image from 'next/image';

export const Preloader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] bg-glass-lemon flex items-center justify-center"
    >
      <div className="overflow-hidden h-8">
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ 
            duration: 0.7,
            ease: [0.43, 0.13, 0.23, 0.96] // Ease out cubic
          }}
          className="flex items-center justify-center"
        >
          <Image
            src="/icons/logotype.svg"
            alt="Lemon"
            width={152}
            height={32}
            priority
          />
        </motion.div>
      </div>
    </motion.div>
  );
} 