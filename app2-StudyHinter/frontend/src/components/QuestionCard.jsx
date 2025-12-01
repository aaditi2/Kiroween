import { motion } from 'framer-motion';
import { useState } from 'react';

const QuestionCard = ({ step, stepNumber, isAnswered, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleOptionClick = (option) => {
    if (isAnswered || selectedOption) return;

    setSelectedOption(option);
    setShowFeedback(true);

    // Call parent callback
    setTimeout(() => {
      onAnswer(step.id, option.id, option.correct);
    }, 100);
  };

  return (
    <motion.div
      className="relative w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Question Card */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-3 border-orange-700/40 backdrop-blur-sm shadow-2xl">
        {/* Spooky decorative elements */}
        <div className="absolute -top-6 -right-6 text-6xl opacity-20 transform rotate-12">
          👻
        </div>
        <div className="absolute -bottom-6 -left-6 text-6xl opacity-20 transform -rotate-12">
          🎃
        </div>

        {/* Question Number Badge */}
        <div className="absolute -top-5 left-8">
          <motion.div
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-purple-600 border-2 border-orange-500 shadow-lg"
            animate={{
              boxShadow: [
                '0 0 20px rgba(249, 115, 22, 0.5)',
                '0 0 30px rgba(249, 115, 22, 0.8)',
                '0 0 20px rgba(249, 115, 22, 0.5)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span className="text-white font-bold text-lg">
              Question {stepNumber}
            </span>
          </motion.div>
        </div>

        {/* Question Title */}
        {step.title && (
          <h3 className="text-3xl font-bold text-orange-300 mb-4 mt-4" style={{ fontFamily: "'Creepster', cursive" }}>
            {step.title}
          </h3>
        )}

        {/* Question Description */}
        <p className="text-gray-200 text-xl mb-8 leading-relaxed">
          {step.description}
        </p>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {step.options && step.options.map((option, index) => {
            const isSelected = selectedOption?.id === option.id;
            const showCorrect = showFeedback && option.correct;
            const showIncorrect = showFeedback && isSelected && !option.correct;

            return (
              <motion.button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                disabled={isAnswered || selectedOption !== null}
                className={`
                  relative p-4 rounded-2xl text-left
                  transition-all duration-300
                  ${showCorrect
                    ? 'bg-green-500/30 border-3 border-green-500 shadow-lg shadow-green-500/50'
                    : showIncorrect
                    ? 'bg-red-500/30 border-3 border-red-500 shadow-lg shadow-red-500/50'
                    : isSelected
                    ? 'bg-orange-600/30 border-3 border-orange-500'
                    : 'bg-gray-800/50 border-2 border-gray-700 hover:border-orange-600/50 hover:bg-gray-800'
                  }
                  ${selectedOption !== null ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={selectedOption === null ? { scale: 1.05, y: -4 } : {}}
                whileTap={selectedOption === null ? { scale: 0.95 } : {}}
              >
                {/* Option Image */}
                {option.image_url && (
                  <div className="relative w-full h-40 mb-3 rounded-xl overflow-hidden bg-gray-900">
                    <img
                      src={option.image_url}
                      alt={option.label}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    {/* Image overlay for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}

                {/* Option Letter Badge */}
                <div className={`
                  absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                  ${showCorrect
                    ? 'bg-green-500 text-white'
                    : showIncorrect
                    ? 'bg-red-500 text-white'
                    : 'bg-orange-600 text-white'
                  }
                  shadow-lg
                `}>
                  {showCorrect ? '✓' : showIncorrect ? '✗' : option.id}
                </div>

                {/* Option Label */}
                <p className="text-gray-100 font-bold text-lg mb-2">
                  {option.label}
                </p>

                {/* Option Reason (shown after selection) */}
                {showFeedback && isSelected && (
                  <motion.p
                    className={`text-sm mt-2 ${option.correct ? 'text-green-300' : 'text-red-300'}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    {option.reason}
                  </motion.p>
                )}

                {/* Sparkle effect for correct answer */}
                {showCorrect && (
                  <>
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-yellow-400"
                        style={{
                          top: '50%',
                          left: '50%',
                        }}
                        animate={{
                          x: [0, (i % 2 === 0 ? 30 : -30)],
                          y: [0, (i < 2 ? -30 : 30)],
                          opacity: [1, 0],
                          scale: [1, 0],
                        }}
                        transition={{
                          duration: 0.8,
                          delay: i * 0.1,
                          ease: 'easeOut',
                        }}
                      />
                    ))}
                  </>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Feedback Message */}
        {showFeedback && (
          <motion.div
            className={`mt-6 p-4 rounded-xl text-center ${
              selectedOption?.correct
                ? 'bg-green-500/20 border-2 border-green-500'
                : 'bg-red-500/20 border-2 border-red-500'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className={`text-xl font-bold ${
              selectedOption?.correct ? 'text-green-300' : 'text-red-300'
            }`}>
              {selectedOption?.correct ? '🎉 Correct! Great job!' : '👻 Oops! Try to remember for next time!'}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default QuestionCard;
