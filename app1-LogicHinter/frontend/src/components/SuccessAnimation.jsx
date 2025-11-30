import { motion, AnimatePresence } from 'framer-motion';
import '../styles/spooky.css';

const SuccessAnimation = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Brief Screen Flash with Green/Gold Glow */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.3), rgba(251, 191, 36, 0.2), transparent)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.8, 1.5, 2],
            }}
            transition={{ 
              duration: 1.2,
              ease: 'easeOut',
            }}
          />

          {/* Central Energy Burst */}
          <motion.div
            className="absolute"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ 
              scale: [0, 1.5, 0],
              rotate: [0, 180],
              opacity: [0, 1, 0],
            }}
            transition={{ 
              duration: 1,
              ease: 'easeOut',
            }}
          >
            <svg width="200" height="200" viewBox="0 0 200 200">
              {/* Mystical Rune Circle */}
              <motion.circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="rgba(16, 185, 129, 0.6)"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
              <motion.circle
                cx="100"
                cy="100"
                r="60"
                fill="none"
                stroke="rgba(251, 191, 36, 0.6)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.1, ease: 'easeInOut' }}
              />
            </svg>
          </motion.div>

          {/* Mystical Sparkles - Particle Dispersal */}
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const distance = 150 + Math.random() * 100;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            return (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: i % 3 === 0 
                    ? 'rgba(16, 185, 129, 0.9)' 
                    : i % 3 === 1 
                    ? 'rgba(251, 191, 36, 0.9)'
                    : 'rgba(52, 211, 153, 0.9)',
                  boxShadow: i % 3 === 0 
                    ? '0 0 10px rgba(16, 185, 129, 1)' 
                    : i % 3 === 1 
                    ? '0 0 10px rgba(251, 191, 36, 1)'
                    : '0 0 10px rgba(52, 211, 153, 1)',
                  left: '50%',
                  top: '50%',
                }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0,
                  opacity: 0,
                }}
                animate={{ 
                  x: endX,
                  y: endY,
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{ 
                  duration: 1.2,
                  delay: i * 0.02,
                  ease: 'easeOut',
                }}
              />
            );
          })}

          {/* Floating Runes/Symbols */}
          {['✦', '✧', '✨', '⚡', '★'].map((rune, i) => {
            const angle = (i / 5) * Math.PI * 2;
            const startDistance = 50;
            const endDistance = 200;
            const startX = Math.cos(angle) * startDistance;
            const startY = Math.sin(angle) * startDistance;
            const endX = Math.cos(angle) * endDistance;
            const endY = Math.sin(angle) * endDistance;
            
            return (
              <motion.div
                key={`rune-${i}`}
                className="absolute text-4xl font-bold"
                style={{
                  color: i % 2 === 0 ? '#10b981' : '#fbbf24',
                  textShadow: i % 2 === 0 
                    ? '0 0 20px rgba(16, 185, 129, 1)' 
                    : '0 0 20px rgba(251, 191, 36, 1)',
                  left: '50%',
                  top: '50%',
                }}
                initial={{ 
                  x: startX, 
                  y: startY, 
                  scale: 0,
                  opacity: 0,
                  rotate: 0,
                }}
                animate={{ 
                  x: endX,
                  y: endY,
                  scale: [0, 1.2, 0.8, 0],
                  opacity: [0, 1, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{ 
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
              >
                {rune}
              </motion.div>
            );
          })}

          {/* Magical Energy Burst - Ring Expansion */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute rounded-full border-4"
              style={{
                borderColor: i % 2 === 0 
                  ? 'rgba(16, 185, 129, 0.6)' 
                  : 'rgba(251, 191, 36, 0.6)',
                width: '100px',
                height: '100px',
                left: '50%',
                top: '50%',
                marginLeft: '-50px',
                marginTop: '-50px',
              }}
              initial={{ 
                scale: 0,
                opacity: 0,
              }}
              animate={{ 
                scale: [0, 3, 4],
                opacity: [0, 0.8, 0],
              }}
              transition={{ 
                duration: 1.2,
                delay: i * 0.15,
                ease: 'easeOut',
              }}
            />
          ))}

          {/* Central Glow Pulse */}
          <motion.div
            className="absolute w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4), rgba(251, 191, 36, 0.3), transparent)',
              filter: 'blur(20px)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 2, 3],
              opacity: [0, 0.8, 0],
            }}
            transition={{ 
              duration: 1.2,
              ease: 'easeOut',
            }}
          />

          {/* Additional Sparkle Trail Particles */}
          {Array.from({ length: 15 }).map((_, i) => {
            const randomAngle = Math.random() * Math.PI * 2;
            const randomDistance = 100 + Math.random() * 150;
            const endX = Math.cos(randomAngle) * randomDistance;
            const endY = Math.sin(randomAngle) * randomDistance;
            
            return (
              <motion.div
                key={`trail-${i}`}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: 'rgba(52, 211, 153, 0.9)',
                  boxShadow: '0 0 6px rgba(52, 211, 153, 1)',
                  left: '50%',
                  top: '50%',
                }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0,
                  opacity: 0,
                }}
                animate={{ 
                  x: [0, endX * 0.5, endX],
                  y: [0, endY * 0.5, endY],
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{ 
                  duration: 1.5,
                  delay: 0.3 + i * 0.03,
                  ease: 'easeOut',
                }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessAnimation;
