import { motion } from 'framer-motion';
import { useState } from 'react';
import '../styles/spooky.css';

const ChoiceButton = ({ 
  choice, 
  onSelect, 
  isSelected = false, 
  isDisabled = false,
  colorVariant = 'purple', // 'purple', 'green', 'orange'
  showCorrect = false,
  showWrong = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Color configurations for different variants
  const colorConfig = {
    purple: {
      bg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(126, 34, 206, 0.25))',
      border: 'rgba(168, 85, 247, 0.6)',
      glow: '0 0 20px rgba(168, 85, 247, 0.5)',
      glowIntense: '0 0 40px rgba(168, 85, 247, 0.9), 0 0 60px rgba(168, 85, 247, 0.6)',
      textColor: '#c084fc',
      textShadow: '0 0 10px rgba(168, 85, 247, 0.8)',
      textShadowIntense: '0 0 20px rgba(168, 85, 247, 1)',
    },
    green: {
      bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.25))',
      border: 'rgba(16, 185, 129, 0.6)',
      glow: '0 0 20px rgba(16, 185, 129, 0.5)',
      glowIntense: '0 0 40px rgba(16, 185, 129, 0.9), 0 0 60px rgba(16, 185, 129, 0.6)',
      textColor: '#34d399',
      textShadow: '0 0 10px rgba(16, 185, 129, 0.8)',
      textShadowIntense: '0 0 20px rgba(16, 185, 129, 1)',
    },
    orange: {
      bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.25))',
      border: 'rgba(245, 158, 11, 0.6)',
      glow: '0 0 20px rgba(245, 158, 11, 0.5)',
      glowIntense: '0 0 40px rgba(245, 158, 11, 0.9), 0 0 60px rgba(245, 158, 11, 0.6)',
      textColor: '#fbbf24',
      textShadow: '0 0 10px rgba(245, 158, 11, 0.8)',
      textShadowIntense: '0 0 20px rgba(245, 158, 11, 1)',
    },
  };

  const config = colorConfig[colorVariant] || colorConfig.purple;

  const handleClick = () => {
    if (!isDisabled && onSelect) {
      onSelect(choice);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      disabled={isDisabled}
      className="relative w-full p-4 md:p-5 rounded-xl font-mono text-left overflow-hidden mystical-cursor"
      style={{
        background: config.bg,
        border: `2px solid ${config.border}`,
        boxShadow: isSelected 
          ? config.glowIntense 
          : config.glow,
        opacity: isDisabled ? 0.5 : 1,
      }}
      // Hover Effect: Intensified glow + slight levitation
      whileHover={!isDisabled ? {
        scale: 1.05,
        y: -5,
        boxShadow: config.glowIntense,
        transition: { duration: 0.2 }
      } : {}}
      // Click Effect
      whileTap={!isDisabled ? {
        scale: 0.98,
      } : {}}
      // Selected State with Pulsing Glow
      animate={isSelected ? {
        boxShadow: [
          config.glow,
          config.glowIntense,
          config.glow,
        ],
      } : {}}
      transition={isSelected ? {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      } : {}}
      // Accessibility
      aria-label={`Choice: ${choice?.text || 'Option'}`}
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
    >
      {/* Wrong Choice Animation: Cracking/Shattering Effect */}
      {showWrong && (
        <>
          {/* Crack Lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={`crack-${i}`}
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            >
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <motion.path
                  d={`M${50 + i * 10},0 L${50 + i * 5},100`}
                  stroke="rgba(239, 68, 68, 0.8)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                />
              </svg>
            </motion.div>
          ))}
          
          {/* Shatter Particles */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.div
              key={`shatter-${i}`}
              className="absolute w-2 h-2 rounded-sm"
              style={{
                background: config.textColor,
                left: `${20 + i * 10}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: [1, 0],
                scale: [1, 0.3],
                x: [(i % 2 === 0 ? -1 : 1) * (20 + i * 10)],
                y: [0, -50 - i * 10],
                rotate: [0, (i % 2 === 0 ? -1 : 1) * 180],
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          ))}

          {/* Red Flash */}
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: 'rgba(239, 68, 68, 0.4)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.5 }}
          />
        </>
      )}

      {/* Correct Choice Animation: Triumphant Glow Burst */}
      {showCorrect && (
        <>
          {/* Energy Burst Rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`burst-${i}`}
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                border: `3px solid ${config.textColor}`,
                boxShadow: config.glowIntense,
              }}
              initial={{ scale: 1, opacity: 1 }}
              animate={{
                scale: [1, 2.5],
                opacity: [1, 0],
              }}
              transition={{
                duration: 1,
                delay: i * 0.15,
                ease: 'easeOut',
              }}
            />
          ))}

          {/* Sparkle Particles */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
            const angle = (i / 12) * Math.PI * 2;
            const distance = 80;
            return (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: config.textColor,
                  boxShadow: config.glow,
                  left: '50%',
                  top: '50%',
                }}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0.5],
                  x: [0, Math.cos(angle) * distance],
                  y: [0, Math.sin(angle) * distance],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.05,
                  ease: 'easeOut',
                }}
              />
            );
          })}

          {/* Golden Flash */}
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${config.textColor}40, transparent)`,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 2],
            }}
            transition={{ duration: 0.8 }}
          />
        </>
      )}

      {/* Magical Sparkles on Click */}
      {isHovered && !isDisabled && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={`hover-sparkle-${i}`}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: config.textColor,
                boxShadow: config.glow,
                left: `${20 + i * 20}%`,
                top: `${10 + (i % 2) * 70}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: [0, -20],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeOut',
              }}
            />
          ))}
        </>
      )}

      {/* Eerie Shadows and 3D Depth */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          boxShadow: 'inset 0 -4px 20px rgba(0, 0, 0, 0.6), inset 0 4px 10px rgba(255, 255, 255, 0.05)',
        }}
        animate={isHovered ? {
          boxShadow: 'inset 0 -6px 30px rgba(0, 0, 0, 0.8), inset 0 6px 15px rgba(255, 255, 255, 0.1)',
        } : {}}
      />

      {/* Potion Bottle/Spell Book Decorative Element */}
      <div className="absolute top-2 right-2 opacity-30">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          {/* Potion Bottle Shape */}
          <motion.path
            d="M12 4 L12 8 L10 10 L10 24 C10 26 11 28 16 28 C21 28 22 26 22 24 L22 10 L20 8 L20 4 Z"
            fill={config.textColor}
            fillOpacity="0.3"
            stroke={config.textColor}
            strokeWidth="1.5"
            animate={isSelected ? {
              fillOpacity: [0.3, 0.6, 0.3],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          {/* Bottle Cork */}
          <rect x="13" y="2" width="6" height="3" rx="1" fill={config.textColor} fillOpacity="0.5" />
          {/* Liquid Inside */}
          <motion.ellipse
            cx="16"
            cy="20"
            rx="5"
            ry="6"
            fill={config.textColor}
            fillOpacity="0.4"
            animate={{
              ry: [6, 7, 6],
              fillOpacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          {/* Bubbles */}
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={`bubble-${i}`}
              cx={14 + i * 2}
              cy={22}
              r="1"
              fill={config.textColor}
              fillOpacity="0.6"
              animate={{
                cy: [22, 12],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeOut',
              }}
            />
          ))}
        </svg>
      </div>

      {/* Choice Text */}
      <motion.div
        className="relative z-10 text-sm md:text-base leading-relaxed pr-10"
        style={{
          color: config.textColor,
          textShadow: isHovered ? config.textShadowIntense : config.textShadow,
        }}
        animate={isSelected ? {
          textShadow: [
            config.textShadow,
            config.textShadowIntense,
            config.textShadow,
          ],
        } : {}}
        transition={isSelected ? {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        } : {}}
      >
        {choice?.text || 'Choose this path...'}
      </motion.div>

      {/* Pulsing Glow Border for Selected State */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            border: `3px solid ${config.textColor}`,
            opacity: 0.5,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Focus State for Accessibility */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 focus-within:opacity-100"
        style={{
          border: `3px solid ${config.textColor}`,
          boxShadow: config.glowIntense,
        }}
      />
    </motion.button>
  );
};

export default ChoiceButton;
