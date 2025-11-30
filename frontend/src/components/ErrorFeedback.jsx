import { motion, AnimatePresence } from 'framer-motion';
import '../styles/spooky.css';

const ErrorFeedback = ({ message, onDismiss, isVisible }) => {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop Blur/Darken Effect */}
          <motion.div
            className="fixed inset-0 z-40 spooky-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onDismiss}
          />

          {/* Ghostly Error Container */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-md w-full pointer-events-auto"
              initial={{ 
                y: 100, 
                opacity: 0, 
                scale: 0.8 
              }}
              animate={{ 
                y: 0, 
                opacity: 1, 
                scale: 1,
                transition: {
                  type: 'spring',
                  damping: 15,
                  stiffness: 100
                }
              }}
              exit={{ 
                y: 100, 
                opacity: 0, 
                scale: 0.8,
                transition: { duration: 0.2 }
              }}
            >
              {/* Floating/Hovering Effect */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {/* Shaking/Trembling Animation */}
                <motion.div
                  animate={{
                    x: [0, -2, 2, -2, 2, 0],
                    rotate: [0, -0.5, 0.5, -0.5, 0.5, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  {/* Ghost/Phantom Styled Error Box */}
                  <div
                    className="relative bg-gradient-to-b from-gray-900/95 to-black/95 rounded-2xl p-6 border-2 border-red-500/50 overflow-hidden"
                    style={{
                      boxShadow: '0 0 40px rgba(239, 68, 68, 0.6), 0 10px 50px rgba(0, 0, 0, 0.9)',
                    }}
                  >
                    {/* Wispy Smoke/Fog Trails - Top */}
                    <motion.div
                      className="absolute top-0 left-0 right-0 h-20 opacity-30 pointer-events-none"
                      style={{
                        background: 'linear-gradient(to bottom, rgba(239, 68, 68, 0.3), transparent)',
                      }}
                      animate={{
                        opacity: [0.2, 0.4, 0.2],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />

                    {/* Wispy Smoke/Fog Trails - Bottom */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-20 opacity-30 pointer-events-none"
                      style={{
                        background: 'linear-gradient(to top, rgba(239, 68, 68, 0.3), transparent)',
                      }}
                      animate={{
                        opacity: [0.3, 0.5, 0.3],
                        scale: [1, 1.15, 1],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.5,
                      }}
                    />

                    {/* Wispy Smoke Particles */}
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={`smoke-${i}`}
                        className="absolute w-1 h-12 rounded-full opacity-20"
                        style={{
                          background: 'linear-gradient(to top, transparent, rgba(239, 68, 68, 0.6), transparent)',
                          left: `${20 + i * 20}%`,
                          bottom: 0,
                        }}
                        animate={{
                          y: [0, -80],
                          opacity: [0, 0.4, 0],
                          x: [0, Math.random() * 20 - 10],
                        }}
                        transition={{
                          duration: 2 + i * 0.3,
                          repeat: Infinity,
                          delay: i * 0.4,
                          ease: 'easeOut',
                        }}
                      />
                    ))}

                    {/* Pulsing Glow Border Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        boxShadow: 'inset 0 0 30px rgba(239, 68, 68, 0.3)',
                      }}
                      animate={{
                        boxShadow: [
                          'inset 0 0 30px rgba(239, 68, 68, 0.3)',
                          'inset 0 0 50px rgba(239, 68, 68, 0.6)',
                          'inset 0 0 30px rgba(239, 68, 68, 0.3)',
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />

                    {/* Ghost Icon/Symbol */}
                    <div className="flex justify-center mb-4">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <svg
                          width="64"
                          height="64"
                          viewBox="0 0 64 64"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* Ghost Body */}
                          <motion.path
                            d="M32 8 C20 8 12 16 12 28 L12 48 L16 44 L20 48 L24 44 L28 48 L32 44 L36 48 L40 44 L44 48 L48 44 L52 48 L52 28 C52 16 44 8 32 8 Z"
                            fill="rgba(239, 68, 68, 0.3)"
                            stroke="rgba(239, 68, 68, 0.9)"
                            strokeWidth="2"
                            animate={{
                              fill: [
                                'rgba(239, 68, 68, 0.3)',
                                'rgba(245, 158, 11, 0.3)',
                                'rgba(239, 68, 68, 0.3)',
                              ],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          />
                          {/* Ghost Eyes */}
                          <motion.circle
                            cx="24"
                            cy="26"
                            r="4"
                            fill="rgba(239, 68, 68, 0.9)"
                            animate={{
                              scaleY: [1, 0.2, 1],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              repeatDelay: 2,
                            }}
                          />
                          <motion.circle
                            cx="40"
                            cy="26"
                            r="4"
                            fill="rgba(239, 68, 68, 0.9)"
                            animate={{
                              scaleY: [1, 0.2, 1],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              repeatDelay: 2,
                            }}
                          />
                          {/* Ghost Mouth (O shape) */}
                          <motion.ellipse
                            cx="32"
                            cy="36"
                            rx="6"
                            ry="8"
                            fill="none"
                            stroke="rgba(239, 68, 68, 0.9)"
                            strokeWidth="2"
                            animate={{
                              ry: [8, 10, 8],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          />
                        </svg>
                      </motion.div>
                    </div>

                    {/* Error Message with Red/Orange Glowing Text */}
                    <motion.div
                      className="relative z-10 mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.p
                        className="text-center text-lg font-mono leading-relaxed"
                        style={{
                          color: '#fbbf24',
                          textShadow: '0 0 20px rgba(239, 68, 68, 0.8)',
                        }}
                        animate={{
                          textShadow: [
                            '0 0 20px rgba(239, 68, 68, 0.8)',
                            '0 0 30px rgba(245, 158, 11, 0.9)',
                            '0 0 20px rgba(239, 68, 68, 0.8)',
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        {message}
                      </motion.p>
                    </motion.div>

                    {/* Dismiss Button - "Banish" Style */}
                    <motion.button
                      onClick={onDismiss}
                      className="w-full py-3 px-6 rounded-lg font-mono font-bold text-lg relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(127, 29, 29, 0.3))',
                        border: '2px solid rgba(239, 68, 68, 0.6)',
                        color: '#fbbf24',
                        textShadow: '0 0 10px rgba(239, 68, 68, 0.8)',
                        boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
                      }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: '0 0 30px rgba(239, 68, 68, 0.8)',
                        textShadow: '0 0 15px rgba(239, 68, 68, 1)',
                      }}
                      whileTap={{
                        scale: 0.95,
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {/* Button Glow Effect */}
                      <motion.div
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.3), transparent)',
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                      
                      <span className="relative z-10">Banish This Warning</span>
                    </motion.button>

                    {/* Floating Embers/Particles around the box */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={`ember-${i}`}
                        className="absolute w-1.5 h-1.5 rounded-full"
                        style={{
                          background: i % 2 === 0 ? '#ef4444' : '#f59e0b',
                          boxShadow: i % 2 === 0 
                            ? '0 0 8px rgba(239, 68, 68, 0.8)' 
                            : '0 0 8px rgba(245, 158, 11, 0.8)',
                          left: `${10 + i * 20}%`,
                          top: '50%',
                        }}
                        animate={{
                          y: [0, -60, -120],
                          x: [0, Math.random() * 40 - 20],
                          opacity: [0, 1, 0],
                          scale: [0.5, 1, 0.3],
                        }}
                        transition={{
                          duration: 3 + i * 0.3,
                          repeat: Infinity,
                          delay: i * 0.5,
                          ease: 'easeOut',
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ErrorFeedback;
