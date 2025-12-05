import { motion, AnimatePresence } from 'framer-motion';
import QuestionCard from './QuestionCard';

const QuizView = ({ quiz, currentStepIndex, answeredSteps, score, onAnswer, isComplete }) => {
  const currentStep = quiz?.steps?.[currentStepIndex];
  const totalSteps = quiz?.steps?.length || 0;
  const progress = (answeredSteps.length / totalSteps) * 100;

  return (
    <div className="relative w-full mt-8">
      {/* Spooky Progress Section */}
      <div className="mb-12 text-center">
        {/* Question Counter - Centered */}
        <motion.div
          className="inline-block mb-6"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span className="text-white text-xl mt-10 font-bold uppercase tracking-wider">
            Question {Math.min(currentStepIndex + 1, totalSteps)} of {totalSteps}
          </span>
        </motion.div>
        
        {/* Spooky Progress Bar with Ghosts */}
        <div className="relative mx-auto" style={{ maxWidth: '600px', padding: '0 1rem' }}>
          <div 
            className="relative rounded-full overflow-hidden" 
            style={{ 
              height: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              border: 'none',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            <motion.div
              className="absolute rounded-full"
              style={{
                top: 0,
                bottom: 0,
                left: 0,
                background: 'linear-gradient(90deg, #f97316, #ef4444, #a855f7)',
                boxShadow: '0 0 20px rgba(249, 115, 22, 0.6)',
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            
            {/* Animated glow */}
            <motion.div
              className="absolute rounded-full"
              style={{
                top: 0,
                bottom: 0,
                left: 0,
                background: 'linear-gradient(90deg, rgba(249, 115, 22, 0.8), rgba(239, 68, 68, 0.8), rgba(168, 85, 247, 0.8))',
                width: `${progress}%`,
                filter: 'blur(8px)',
              }}
              animate={{
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
          
          {/* Floating ghost at progress end */}
          {progress > 5 && (
            <motion.div
              className="absolute text-3xl"
              style={{ 
                left: `${Math.min(progress, 98)}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                y: [-3, 3, -3],
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              👻
            </motion.div>
          )}
        </div>
      </div>

      {/* Current Question */}
      <AnimatePresence mode="wait">
        {!isComplete && currentStep && (
          <motion.div
            key={`step-${currentStepIndex}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <QuestionCard
              step={currentStep}
              stepNumber={currentStepIndex + 1}
              isAnswered={answeredSteps.includes(currentStep.id)}
              onAnswer={onAnswer}
            />
          </motion.div>
        )}

        {/* Completion Screen */}
        {isComplete && (
          <motion.div
            key="completion"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <motion.div
              className="w-40 h-40 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center shadow-2xl"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <span className="text-7xl">
                {score === totalSteps ? '🏆' : score >= totalSteps * 0.7 ? '🎉' : '👻'}
              </span>
            </motion.div>

            <h2 className="text-5xl font-bold text-orange-300 mb-4" style={{ fontFamily: "'Creepster', cursive" }}>
              {score === totalSteps ? 'Perfect Score!' : score >= totalSteps * 0.7 ? 'Great Job!' : 'Good Try!'}
            </h2>

            <p className="text-2xl text-gray-300 mb-6">
              You got <span className="text-orange-400 font-bold">{score}</span> out of{' '}
              <span className="text-purple-400 font-bold">{totalSteps}</span> correct!
            </p>

            <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
              {score === totalSteps && (
                <div className="px-6 py-3 bg-yellow-500/20 border-2 border-yellow-500 rounded-xl">
                  <span className="text-yellow-300 text-lg">🌟 You're a Quiz Master! 🌟</span>
                </div>
              )}
              {score >= totalSteps * 0.7 && score < totalSteps && (
                <div className="px-6 py-3 bg-green-500/20 border-2 border-green-500 rounded-xl">
                  <span className="text-green-300 text-lg">✨ Almost Perfect! ✨</span>
                </div>
              )}
              {score < totalSteps * 0.7 && (
                <div className="px-6 py-3 bg-purple-500/20 border-2 border-purple-500 rounded-xl">
                  <span className="text-purple-300 text-lg">💪 Keep Learning! 💪</span>
                </div>
              )}
            </div>

            {/* Floating celebration particles */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const distance = 150;
              return (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-4 h-4 rounded-full"
                  style={{
                    background: i % 3 === 0 ? '#f97316' : i % 3 === 1 ? '#a855f7' : '#fbbf24',
                    boxShadow: '0 0 10px currentColor',
                    left: '50%',
                    top: '30%',
                  }}
                  animate={{
                    x: [0, Math.cos(angle) * distance, 0],
                    y: [0, Math.sin(angle) * distance, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizView;
