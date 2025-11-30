import { motion } from 'framer-motion';

const SpookyBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />

      {/* Subtle animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.15), transparent 70%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 100px 30px rgba(0, 0, 0, 0.8)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default SpookyBackground;
