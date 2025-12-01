import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = "Creating your spooky quiz..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Animated pumpkin spinner */}
      <div className="relative w-32 h-32 mb-8">
        {/* Rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-orange-500/30"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className="absolute top-0 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-orange-500" />
        </motion.div>

        {/* Counter-rotating ring */}
        <motion.div
          className="absolute inset-3 rounded-full border-4 border-purple-500/30"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className="absolute top-0 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-purple-500" />
        </motion.div>

        {/* Center pumpkin */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
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
          <span className="text-6xl">🎃</span>
        </motion.div>

        {/* Glowing effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-orange-500/20"
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

      {/* Loading text */}
      <motion.p
        className="text-gray-300 text-xl mb-4"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {message}
      </motion.p>

      {/* Animated dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-orange-500"
            animate={{
              y: [0, -12, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Floating ghosts */}
      {[0, 1].map((i) => (
        <motion.div
          key={`ghost-${i}`}
          className="absolute text-4xl"
          style={{
            left: i === 0 ? '30%' : '70%',
            top: '40%',
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, i === 0 ? -10 : 10, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1.5,
            ease: 'easeInOut',
          }}
        >
          👻
        </motion.div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
