import { motion } from 'framer-motion';
import { useState } from 'react';
import ChoiceButton from './ChoiceButton';

const StepNode = ({ 
  step, 
  onChoiceSelect, 
  isActive = true,
  stepNumber = 1,
  showChoices = true
}) => {
  const [selectedChoice, setSelectedChoice] = useState(null);

  const handleChoiceSelect = (option) => {
    setSelectedChoice(option);
    if (onChoiceSelect) {
      onChoiceSelect(step.id, option.id);
    }
  };

  if (!step) {
    return null;
  }

  return (
    <motion.div
      className="relative w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Step Card */}
      <div className="relative p-8 rounded-2xl bg-gray-900/50 border-2 border-purple-700/30 backdrop-blur-sm">
        {/* Step Number Badge */}
        <div className="absolute -top-4 left-8">
          <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 border border-purple-500 shadow-lg">
            <span className="text-white font-semibold text-sm">
              Step {stepNumber}
            </span>
          </div>
        </div>

        {/* Step Title */}
        {step.title && (
          <h3 className="text-2xl font-bold text-purple-300 mb-3 mt-2">
            {step.title}
          </h3>
        )}

        {/* Step Description */}
        <p className="text-gray-300 text-lg mb-6 leading-relaxed">
          {step.description}
        </p>

        {/* Options */}
        {showChoices && step.options && step.options.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">Choose the best approach:</p>
            {step.options.map((option, index) => (
              <motion.button
                key={option.id}
                onClick={() => handleChoiceSelect(option)}
                disabled={selectedChoice !== null}
                className={`
                  w-full p-5 rounded-xl text-left
                  transition-all duration-200
                  ${selectedChoice?.id === option.id
                    ? 'bg-purple-600/30 border-2 border-purple-500'
                    : 'bg-gray-800/50 border-2 border-gray-700 hover:border-purple-600/50 hover:bg-gray-800'
                  }
                  ${selectedChoice !== null ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
                `}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={selectedChoice === null ? { scale: 1.02, x: 4 } : {}}
                whileTap={selectedChoice === null ? { scale: 0.98 } : {}}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${selectedChoice?.id === option.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-700 text-gray-400'
                    }
                  `}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-200 font-medium mb-1">
                      {option.label}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {option.reason}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {!showChoices && (
          <div className="text-center py-4">
            <p className="text-gray-500 italic">Processing your choice...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StepNode;
