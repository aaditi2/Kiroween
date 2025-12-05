import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const QuestionCard = ({ step, onAnswer, isAnswered = false }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [wrongOptions, setWrongOptions] = useState(new Set());
  const [showErrorOverlay, setShowErrorOverlay] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [canProgress, setCanProgress] = useState(false);

  // Reset state when step changes
  useEffect(() => {
    setSelectedOption(null);
    setShowFeedback(false);
    setWrongOptions(new Set());
    setShowErrorOverlay(false);
    setErrorMessage('');
    setCanProgress(isAnswered);
  }, [step.id, isAnswered]);

  const handleOptionClick = (option) => {
    // Prevent clicking if already answered correctly
    if (isAnswered || canProgress) return;

    setSelectedOption(option);
    setShowFeedback(true);

    if (option.correct) {
      // Correct answer - show success animation and allow progression
      setCanProgress(true);
      
      // Call parent callback after a short delay to allow animation to start
      setTimeout(() => {
        onAnswer(step.id, option.id, option.correct);
      }, 100);
    } else {
      // Wrong answer - add to wrong options and show error overlay
      setWrongOptions(prev => new Set([...prev, option.id]));
      setErrorMessage(option.reason || 'This is not the correct answer. Try again!');
      setShowErrorOverlay(true);
    }
  };

  const handleErrorOverlayClose = () => {
    setShowErrorOverlay(false);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  return (
    <motion.div
      className="relative w-full max-w-2xl mx-auto mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Question Title */}
      {step.title && (
        <h3 className="text-4xl font-bold text-orange-300 mb-1 text-center" style={{ fontFamily: "'Creepster', cursive", paddingBottom:'0' }}>
          {step.title}
        </h3>
      )}

      {/* Question Description */}
      <p className="text-gray-200 text-xl mb-8 leading-relaxed text-center">
        {step.description}
      </p>

      {/* Options Grid - A,B top row, C,D bottom row */}
      <div className="grid grid-cols-2 mx-auto" style={{ maxWidth: '500px', gap: '2rem' }}>
          {step.options && step.options.sort((a, b) => a.id.localeCompare(b.id)).map((option) => {
            const isSelected = selectedOption?.id === option.id;
            const showCorrect = canProgress && option.correct;
            const showIncorrect = showFeedback && isSelected && !option.correct;
            const wasWrong = wrongOptions.has(option.id);

            return (
              <motion.button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                disabled={canProgress && !option.correct}
                className={`
                  relative rounded-xl p-3 flex flex-col items-center text-center
                  w-full
                  transition-all duration-300
                  ${showCorrect
                    ? 'bg-green-500/30 border-2 border-green-500 shadow-green-500/50'
                    : showIncorrect
                    ? 'bg-red-500/30 border-2 border-red-500 shadow-red-500/50'
                    : wasWrong
                    ? 'bg-red-500/20 border-2 border-red-400/50 opacity-70'
                    : isSelected
                    ? 'bg-orange-600/30 border-2 border-orange-500'
                    : 'bg-gray-900/70 border-2 border-gray-700 hover:border-orange-500/50 hover:bg-gray-800/70'
                  }
                  ${canProgress && !option.correct ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                `}
                animate={showCorrect ? {
                  scale: [1, 1.2, 1.5, 0],
                  opacity: [1, 1, 1, 0]
                } : {}}
                transition={showCorrect ? {
                  duration: 2,
                  times: [0, 0.3, 0.7, 1],
                  ease: "easeInOut"
                } : {}}
              >
  {/* LARGE IMAGE — fills most of card */}
  {option.image_url && (
    <div className="rounded-lg overflow-hidden bg-black mb-3 w-full"
         style={{ height: '180px' }}>
      <img
        src={option.image_url}
        alt={option.label}
        className="object-cover w-full h-full"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    </div>
  )}

                {/* LARGE IMAGE — fills most of card */}
                {option.image_url && (
                  <div className="rounded-lg overflow-hidden bg-black mb-3 w-full"
                       style={{ height: '180px' }}>
                    <img
                      src={option.image_url}
                      alt={option.label}
                      className="object-cover w-full h-full"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}

                {/* LETTER + LABEL */}
                <div className="flex w-full gap-2 justify-start items-start px-1">
                  <span className={`
                    text-lg font-bold
                    ${showCorrect ? 'text-green-400'
                      : showIncorrect || wasWrong ? 'text-red-400'
                      : 'text-purple-400'}
                  `}>
                    {showCorrect ? (
                      <motion.span
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: [0, 1, 1.5, 2], rotate: [0, 0, 180, 360] }}
                        transition={{ 
                          duration: 1.5,
                          times: [0, 0.3, 0.6, 1],
                          ease: "easeInOut"
                        }}
                        className="inline-block text-5xl"
                      >
                        ✓
                      </motion.span>
                    ) : (showIncorrect || wasWrong) ? '✗' : `${option.id}.`}
                  </span>

                  <p className="text-gray-100 font-bold text-base leading-tight">
                    {option.label}
                  </p>
                </div>
              </motion.button>


            );
          })}
        </div>

      {/* Error Overlay - Centered on page with z-index 40 */}
      <AnimatePresence>
        {showErrorOverlay && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center px-4"
            style={{ zIndex: 40 }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleErrorOverlayClose} />
            
            {/* Error Card */}
            <div className="relative bg-gradient-to-r from-red-900/95 to-red-800/95 backdrop-blur-md border-2 border-red-500 rounded-2xl p-6 shadow-2xl max-w-2xl w-full">
              <div className="flex items-start gap-4">
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className="text-4xl flex-shrink-0"
                >
                  ❌
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-red-200 font-bold text-xl mb-2">Oops! Not quite right</h3>
                  <p className="text-red-100 text-lg leading-relaxed">{errorMessage}</p>
                  <p className="text-red-300 text-sm mt-3 font-semibold">Try another option! 🤔</p>
                </div>
                <button
                  onClick={handleErrorOverlayClose}
                  className="text-red-300 hover:text-red-100 text-3xl font-bold transition-colors leading-none"
                >
                  ×
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuestionCard;
