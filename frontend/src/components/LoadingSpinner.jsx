import { motion } from 'framer-motion';
import '../styles/spooky.css';

const LoadingSpinner = ({ message = "Summoning your guidance..." }) => {
  // Generate orbiting particles
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 8,
  }));

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] relative">
      {/* Fog Swirling Animation */}
      <motion.div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary Fog Layer - Green */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.15, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Main Spinner Container */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Mystical Rune Circle - Outer Ring */}
        <motion.div
          className="absolute w-32 h-32 rounded-full border-2 border-purple-500/30"
          style={{
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
          }}
          animate={{
            rotate: 360,
            boxShadow: [
              '0 0 20px rgba(168, 85, 247, 0.4)',
              '0 0 40px rgba(168, 85, 247, 0.8)',
              '0 0 20px rgba(168, 85, 247, 0.4)',
            ],
          }}
          transition={{
            rotate: {
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            },
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          {/* Rune Symbols on Outer Ring */}
          {[0, 90, 180, 270].map((angle, i) => (
            <div
              key={i}
              className="absolute w-3 h-3"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-60px)`,
              }}
            >
              <motion.div
                className="w-full h-full bg-purple-400 rounded-sm"
                style={{
                  boxShadow: '0 0 10px rgba(168, 85, 247, 0.8)',
                }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            </div>
          ))}
        </motion.div>

        {/* Middle Ring - Counter Rotation */}
        <motion.div
          className="absolute w-24 h-24 rounded-full border-2 border-green-500/30"
          style={{
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
          }}
          animate={{
            rotate: -360,
            boxShadow: [
              '0 0 15px rgba(16, 185, 129, 0.4)',
              '0 0 30px rgba(16, 185, 129, 0.8)',
              '0 0 15px rgba(16, 185, 129, 0.4)',
            ],
          }}
          transition={{
            rotate: {
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            },
            boxShadow: {
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        />

        {/* Central Cauldron/Skull SVG */}
        <motion.div
          className="relative z-10"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Mystical Cauldron */}
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Cauldron Body */}
            <motion.path
              d="M12 18 L10 32 Q10 38 16 40 L32 40 Q38 38 38 32 L36 18 Z"
              fill="rgba(168, 85, 247, 0.3)"
              stroke="rgba(168, 85, 247, 0.9)"
              strokeWidth="2"
              animate={{
                fill: [
                  'rgba(168, 85, 247, 0.3)',
                  'rgba(16, 185, 129, 0.3)',
                  'rgba(168, 85, 247, 0.3)',
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            {/* Cauldron Rim */}
            <motion.ellipse
              cx="24"
              cy="18"
              rx="12"
              ry="3"
              fill="rgba(168, 85, 247, 0.5)"
              stroke="rgba(168, 85, 247, 0.9)"
              strokeWidth="2"
              animate={{
                fill: [
                  'rgba(168, 85, 247, 0.5)',
                  'rgba(16, 185, 129, 0.5)',
                  'rgba(168, 85, 247, 0.5)',
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            {/* Bubbling Potion */}
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx={20 + i * 4}
                cy={28}
                r="2"
                fill="rgba(16, 185, 129, 0.8)"
                animate={{
                  cy: [28, 20, 28],
                  opacity: [0.8, 0, 0.8],
                  scale: [1, 0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </svg>
        </motion.div>

        {/* Orbiting Glowing Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: particle.id % 2 === 0 ? '#a855f7' : '#10b981',
              boxShadow:
                particle.id % 2 === 0
                  ? '0 0 10px rgba(168, 85, 247, 0.8)'
                  : '0 0 10px rgba(16, 185, 129, 0.8)',
            }}
            animate={{
              x: [
                Math.cos((particle.angle * Math.PI) / 180) * 70,
                Math.cos(((particle.angle + 360) * Math.PI) / 180) * 70,
              ],
              y: [
                Math.sin((particle.angle * Math.PI) / 180) * 70,
                Math.sin(((particle.angle + 360) * Math.PI) / 180) * 70,
              ],
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}

        {/* Pulsing Glow Effect */}
        <motion.div
          className="absolute w-40 h-40 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Spooky Loading Text */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.p
          className="text-lg font-mono text-purple-300"
          style={{
            textShadow: '0 0 20px rgba(168, 85, 247, 0.6)',
          }}
          animate={{
            opacity: [0.7, 1, 0.7],
            textShadow: [
              '0 0 20px rgba(168, 85, 247, 0.6)',
              '0 0 30px rgba(16, 185, 129, 0.8)',
              '0 0 20px rgba(168, 85, 247, 0.6)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {message}
        </motion.p>
        
        {/* Animated Dots */}
        <motion.div className="flex justify-center gap-2 mt-3">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-purple-400"
              style={{
                boxShadow: '0 0 8px rgba(168, 85, 247, 0.8)',
              }}
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Ethereal Wisps */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={`wisp-${i}`}
          className="absolute w-1 h-8 rounded-full opacity-30"
          style={{
            background: i % 2 === 0 
              ? 'linear-gradient(to top, transparent, rgba(168, 85, 247, 0.6), transparent)'
              : 'linear-gradient(to top, transparent, rgba(16, 185, 129, 0.6), transparent)',
            left: `${25 + i * 15}%`,
            bottom: '20%',
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 0.6, 0],
            x: [0, Math.random() * 20 - 10],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.7,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

export default LoadingSpinner;
