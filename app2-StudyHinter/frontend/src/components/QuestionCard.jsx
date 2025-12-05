import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const QuestionCard = ({ step, stepNumber, isAnswered, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Play tick sound for correct answers
  useEffect(() => {
    if (showFeedback && selectedOption?.correct) {
      // Create and play a simple tick sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  }, [showFeedback, selectedOption]);

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
          {step.options && step.options.sort((a, b) => a.id.localeCompare(b.id)).map((option, index) => {
            const isSelected = selectedOption?.id === option.id;
            const showCorrect = showFeedback && option.correct;
            const showIncorrect = showFeedback && isSelected && !option.correct;

            return (
              
              <motion.button
  key={option.id}
  onClick={() => handleOptionClick(option)}
  disabled={isAnswered || selectedOption !== null}
  className={`
    relative rounded-xl p-3 flex flex-col items-center text-center
    w-full
    transition-all duration-300
    ${showCorrect
      ? 'bg-green-500/30 border-2 border-green-500 shadow-green-500/50'
      : showIncorrect
      ? 'bg-red-500/30 border-2 border-red-500 shadow-red-500/50'
      : isSelected
      ? 'bg-orange-600/30 border-2 border-orange-500'
      : 'bg-gray-900/70 border-2 border-gray-700 hover:border-orange-500/50 hover:bg-gray-800/70'
    }
    ${selectedOption !== null ? 'cursor-not-allowed' : 'cursor-pointer'}
  `}
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
        : showIncorrect ? 'text-red-400'
        : 'text-purple-400'}
    `}>
      {showCorrect ? (
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 15,
            duration: 0.4
          }}
          className="inline-block text-5xl"
        >
          ✓
        </motion.span>
      ) : showIncorrect ? '✗' : `${option.id}.`}
    </span>

    <p className="text-gray-100 font-bold text-base leading-tight">
      {option.label}
    </p>
  </div>

  {/* REASON BELOW, ONLY WHEN WRONG ANSWER */}
  {showFeedback && isSelected && !option.correct && (
    <motion.p
      className="text-sm mt-2 text-red-300"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
    >
      {option.reason}
    </motion.p>
  )}
</motion.button>


            );
          })}
        </div>

      {/* Feedback Message - Only for wrong answers */}
      {showFeedback && !selectedOption?.correct && (
        <motion.div
          className="mt-6 p-4 rounded-xl text-center max-w-md mx-auto bg-red-500/20 border-2 border-red-500"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xl font-bold text-red-300">
            👻 Oops! Try to remember for next time!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuestionCard;
