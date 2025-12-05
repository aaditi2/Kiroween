import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const QuestionCard = ({ step, onAnswer, isAnswered = false }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [wrongOptions, setWrongOptions] = useState(new Set());
  const [showErrorOverlay, setShowErrorOverlay] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [canProgress, setCanProgress] = useState(false);
  const [starsEarned, setStarsEarned] = useState(4);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [finalStarsForAnimation, setFinalStarsForAnimation] = useState(4);

  const calculateStarsFromWrongAttempts = (attempts) => {
    if (attempts === 0) return 4; // Correct on first try
    if (attempts === 1) return 3; // One wrong attempt
    if (attempts === 2) return 2; // Two wrong attempts
    return 1; // Three or more wrong attempts
  };
  
  // Reset state when step changes
  useEffect(() => {
    setSelectedOption(null);
    setShowFeedback(false);
    setWrongOptions(new Set());
    setShowErrorOverlay(false);
    setErrorMessage('');
    setCanProgress(isAnswered);
    setWrongAttempts(0);
    setStarsEarned(4); // Reset to 4 stars for new question
    setFinalStarsForAnimation(4); // Reset animation stars too
  }, [step.id]);

  useEffect(() => {
    setCanProgress(isAnswered);
  }, [isAnswered]);

  // Success sound for correct answers
  const playSuccessSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Success sound - cheerful ascending notes (C-E-G-C major chord arpeggio)
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.15); // E5
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.3); // G5
      oscillator.frequency.setValueAtTime(1047, audioContext.currentTime + 0.45); // C6
      
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.6);
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  };

  const handleOptionClick = (option) => {
    // Prevent clicking if already answered correctly
    if (isAnswered || canProgress) return;



    setSelectedOption(option);
    setShowFeedback(true);

    if (option.correct) {
      // Correct answer - play success sound and show animation
      playSuccessSound();
      setCanProgress(true);
      
      // Calculate and set final stars earned
      const finalStarsEarned = Math.max(1, 4 - wrongAttempts);
      setStarsEarned(finalStarsEarned);
      setFinalStarsForAnimation(finalStarsEarned); // Preserve for animation
      
      console.log('🎯 CORRECT ANSWER! Wrong attempts:', wrongAttempts, 'Final stars:', finalStarsEarned);
      console.log('🎯 Animation will show:', finalStarsEarned, 'stars');

      setTimeout(() => {
        onAnswer(step.id, option.id, option.correct, finalStarsEarned);
      }, 100);
    } else {
      // Wrong answer - increment counter and update stars
      const newWrongAttempts = wrongAttempts + 1;
      setWrongAttempts(newWrongAttempts);
      const newStarsEarned = Math.max(1, 4 - newWrongAttempts);
      
      console.log('❌ WRONG! Attempts now:', newWrongAttempts, 'Stars now:', newStarsEarned);
      setStarsEarned(newStarsEarned);
      setFinalStarsForAnimation(newStarsEarned); // Update animation stars too!
      
      setWrongOptions(prev => {
        const newWrongOptions = new Set([...prev, option.id]);

        return newWrongOptions;
      });
      

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
          {step.options && step.options.map((option) => {
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

                {/* LETTER + LABEL */}
                <div className="flex w-full gap-2 justify-start items-start px-1">
                  <span className={`
                    text-lg font-bold
                    ${showCorrect ? 'text-green-400'
                      : showIncorrect || wasWrong ? 'text-red-400'
                      : 'text-purple-400'}
                  `}>
                    {showCorrect ? (
                      <div className="flex flex-col items-center">
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1, 1.5, 2] }}
                          transition={{ 
                            duration: 1.5,
                            times: [0, 0.3, 0.6, 1],
                            ease: "easeInOut"
                          }}
                          className="inline-block text-5xl text-green-500"
                        >
                          ✓
                        </motion.span>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                          className="flex gap-1 mt-1"
                        >
                          {Array.from({ length: finalStarsForAnimation }).map((_, i) => (
                            <motion.span
                              key={i}
                              initial={{ scale: 0, rotate: 0 }}
                              animate={{ scale: 1, rotate: 360 }}
                              transition={{ delay: 0.7 + i * 0.1, duration: 0.3 }}
                              className="text-yellow-400 text-lg"
                            >
                              ⭐
                            </motion.span>
                          ))}
                        </motion.div>
                      </div>
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

      {/* Error Overlay - Compact popup like app1 */}
      {showErrorOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg rounded-xl border border-orange-500/50 bg-gray-900/95 px-5 py-3 shadow-lg flex items-center gap-4"
          >
            {/* Text */}
            <p className="flex-1 text-sm text-gray-200">
              <span className="font-semibold text-orange-400">⚠️ Wrong option. </span>
              {errorMessage}
            </p>

            {/* Button */}
            <button
              onClick={handleErrorOverlayClose}
              className="rounded-md border border-orange-500/50 px-3 py-1.5 text-xs font-semibold text-orange-400 hover:bg-orange-500/10 transition"
            >
              Understood
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default QuestionCard;
