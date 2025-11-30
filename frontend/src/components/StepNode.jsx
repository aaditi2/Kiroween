import { motion } from 'framer-motion';
import { useState } from 'react';
import ChoiceButton from './ChoiceButton';
import '../styles/spooky.css';

const StepNode = ({ 
  step, 
  onChoiceSelect, 
  isActive = true,
  stepNumber = 1,
  showChoices = true
}) => {
  const [selectedChoice, setSelectedChoice] = useState(null);

  const handleChoiceSelect = (choice) => {
    setSelectedChoice(choice);
    if (onChoiceSelect) {
      onChoiceSelect(choice);
    }
  };

  // Mystical rune symbols for step numbers (0-9)
  const runeSymbols = ['⚬', '᛫', '᛬', '⁂', '✦', '✧', '✪', '✫', '✬', '✭'];
  const runeSymbol = runeSymbols[stepNumber % 10];

  return (
    <motion.div
      className="relative w-full max-w-3xl mx-auto"
      // Ethereal entrance animation (fade from mist)
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
      }}
      exit={{ opacity: 0, scale: 0.9, y: -30 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] // Custom easing for ethereal feel
      }}
    >
      {/* Tombstone/Crystal Ball Container */}
      <motion.div
        className="relative p-8 rounded-3xl overflow-hidden mystical-cursor"
        style={{
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(126, 34, 206, 0.15))',
          border: '3px solid rgba(168, 85, 247, 0.4)',
          boxShadow: isActive 
            ? '0 0 40px rgba(168, 85, 247, 0.6), 0 0 80px rgba(168, 85, 247, 0.3), inset 0 0 30px rgba(168, 85, 247, 0.1)'
            : '0 0 20px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.05)',
        }}
        // Floating animation (gentle hover effect, 2-4s loop)
        animate={{
          y: [0, -8, 0],
          rotateX: [0, 2, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Pulsing Glow around active step */}
        {isActive && (
          <>
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                border: '2px solid rgba(168, 85, 247, 0.6)',
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
            
            {/* Outer pulsing ring */}
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                border: '1px solid rgba(168, 85, 247, 0.4)',
              }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            />
          </>
        )}

        {/* Layered shadows for depth */}
        <div 
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            boxShadow: `
              inset 0 -8px 30px rgba(0, 0, 0, 0.6),
              inset 0 8px 20px rgba(255, 255, 255, 0.03),
              inset -5px 0 15px rgba(0, 0, 0, 0.4),
              inset 5px 0 15px rgba(0, 0, 0, 0.4)
            `,
          }}
        />

        {/* Mystical fog effect inside */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden"
          style={{
            background: 'radial-gradient(circle at 50% 100%, rgba(168, 85, 247, 0.15), transparent 70%)',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Glowing Runes/Mystical Symbols as decorative elements */}
        <div className="absolute top-4 left-4 opacity-40">
          <motion.svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            animate={{
              rotate: [0, 360],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            {/* Mystical Circle Rune */}
            <circle cx="20" cy="20" r="15" stroke="#a855f7" strokeWidth="1.5" fill="none" />
            <circle cx="20" cy="20" r="10" stroke="#a855f7" strokeWidth="1" fill="none" />
            <circle cx="20" cy="20" r="5" stroke="#a855f7" strokeWidth="0.5" fill="none" />
            {/* Rune Lines */}
            <line x1="20" y1="5" x2="20" y2="15" stroke="#a855f7" strokeWidth="1" />
            <line x1="20" y1="25" x2="20" y2="35" stroke="#a855f7" strokeWidth="1" />
            <line x1="5" y1="20" x2="15" y2="20" stroke="#a855f7" strokeWidth="1" />
            <line x1="25" y1="20" x2="35" y2="20" stroke="#a855f7" strokeWidth="1" />
            {/* Diagonal Lines */}
            <line x1="9" y1="9" x2="14" y2="14" stroke="#a855f7" strokeWidth="0.5" />
            <line x1="31" y1="9" x2="26" y2="14" stroke="#a855f7" strokeWidth="0.5" />
            <line x1="9" y1="31" x2="14" y2="26" stroke="#a855f7" strokeWidth="0.5" />
            <line x1="31" y1="31" x2="26" y2="26" stroke="#a855f7" strokeWidth="0.5" />
          </motion.svg>
        </div>

        <div className="absolute top-4 right-4 opacity-40">
          <motion.svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            animate={{
              rotate: [360, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
              opacity: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 },
            }}
          >
            {/* Pentagram Rune */}
            <path
              d="M20,5 L24,17 L37,17 L27,25 L31,37 L20,29 L9,37 L13,25 L3,17 L16,17 Z"
              stroke="#10b981"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="20" cy="20" r="18" stroke="#10b981" strokeWidth="0.5" fill="none" />
          </motion.svg>
        </div>

        {/* Step Number as Mystical Rune or Glowing Number */}
        <motion.div
          className="absolute -top-6 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, -5, 0],
            textShadow: [
              '0 0 10px rgba(168, 85, 247, 0.8)',
              '0 0 20px rgba(168, 85, 247, 1), 0 0 30px rgba(168, 85, 247, 0.8)',
              '0 0 10px rgba(168, 85, 247, 0.8)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div
            className="flex items-center justify-center w-16 h-16 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3), rgba(126, 34, 206, 0.5))',
              border: '2px solid rgba(168, 85, 247, 0.8)',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.6), inset 0 0 15px rgba(168, 85, 247, 0.3)',
            }}
          >
            <span
              className="text-3xl font-bold"
              style={{
                fontFamily: "'Creepster', cursive",
                color: '#c084fc',
                textShadow: '0 0 15px rgba(168, 85, 247, 1)',
              }}
            >
              {runeSymbol}
            </span>
          </div>
        </motion.div>

        {/* Step Description with Creepy Typography */}
        <motion.div
          className="relative z-10 mb-8 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h3
            className="text-2xl md:text-3xl mb-2 leading-relaxed"
            style={{
              fontFamily: "'Creepster', cursive",
              color: '#c084fc',
              textShadow: '0 0 15px rgba(168, 85, 247, 0.8), 0 2px 4px rgba(0, 0, 0, 0.8)',
              letterSpacing: '0.05em',
            }}
          >
            {step?.description || 'Choose your path...'}
          </h3>
          
          {/* Decorative line under description */}
          <motion.div
            className="h-0.5 mt-4"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.6), transparent)',
              boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)',
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </motion.div>

        {/* Choice Buttons */}
        {showChoices && step?.choices && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {step.choices.map((choice, index) => {
              const colorVariants = ['purple', 'green', 'orange'];
              const colorVariant = colorVariants[index % 3];
              
              return (
                <motion.div
                  key={choice.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 0.7 + index * 0.15, 
                    duration: 0.5,
                    ease: 'easeOut'
                  }}
                >
                  <ChoiceButton
                    choice={choice}
                    onSelect={handleChoiceSelect}
                    isSelected={selectedChoice?.id === choice.id}
                    colorVariant={colorVariant}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Floating mystical particles around the step */}
        {isActive && (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: i % 2 === 0 ? '#a855f7' : '#10b981',
                  boxShadow: i % 2 === 0 
                    ? '0 0 8px rgba(168, 85, 247, 0.8)' 
                    : '0 0 8px rgba(16, 185, 129, 0.8)',
                  left: `${10 + i * 20}%`,
                  top: `${5 + (i % 2) * 85}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, (i % 2 === 0 ? 10 : -10), 0],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </>
        )}

        {/* Ancient scroll texture overlay */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none opacity-5"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(168, 85, 247, 0.1) 2px,
                rgba(168, 85, 247, 0.1) 4px
              )
            `,
          }}
        />
      </motion.div>

      {/* Shadow beneath tombstone for depth */}
      <motion.div
        className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-4/5 h-8 rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(168, 85, 247, 0.3), transparent)',
          filter: 'blur(10px)',
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scaleX: [0.9, 1, 0.9],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};

export default StepNode;
