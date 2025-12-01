import '../styles/spooky.css';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProblemInput = ({ onSubmit, isLoading }) => {
  const [problemText, setProblemText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showCharCount, setShowCharCount] = useState(false);

  const maxLength = 2000;
  const charCount = problemText.length;
  const charPercentage = (charCount / maxLength) * 100;

  // Detect typing
  useEffect(() => {
    if (problemText.length > 0) {
      setIsTyping(true);
      const timeout = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [problemText]);

  // Show char count
  useEffect(() => {
    if (isFocused || charPercentage > 70) {
      setShowCharCount(true);
    } else {
      setShowCharCount(false);
    }
  }, [isFocused, charPercentage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (problemText.trim() && !isLoading) {
      onSubmit(problemText.trim());
    }
  };

  const handleClear = () => setProblemText('');

  const getCharCountColor = () => {
    if (charPercentage > 90) return 'text-red-400';
    if (charPercentage > 70) return 'text-orange-400';
    return 'text-purple-400';
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">

        {/* Main Input Container */}
        <div className="relative">
          {/* Floating Placeholder */}
          <AnimatePresence>
            {!problemText && !isFocused && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-500 text-lg text-center px-8">
                  Describe your coding problem or algorithm challenge...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Textarea */}
          <textarea
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={maxLength}
            disabled={isLoading}
            className={`
              w-full h-64 px-6 py-4 
              bg-gray-900 
              border-2 rounded-lg
              text-gray-200 text-base
              resize-none
              transition-all duration-200
              focus:outline-none
              placeholder-transparent
              ${isFocused ? 'border-purple-500' : 'border-gray-700'}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          />

          {/* Character count */}
          {showCharCount && (
            <div className={`absolute bottom-4 right-6 ${getCharCountColor()} text-sm`}>
              {charCount} / {maxLength}
            </div>
          )}
        </div>

        {/* -------------------- PATCHED BUTTON AREA -------------------- */}
        <div className="flex gap-4 mt-8 justify-center">

          {/* Submit Button (PATCH APPLIED) */}
          <motion.button
            type="submit"
            disabled={!problemText.trim() || isLoading}
            className={`
              px-3 py-2
              bg-gradient-to-r from-purple-600 to-purple-700
              hover:from-purple-500 hover:to-purple-600
              border border-purple-500
              rounded-lg
              text-white font-semibold text-sm md:text-base
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            whileHover={problemText.trim() && !isLoading ? { scale: 1.02 } : {}}
            whileTap={problemText.trim() && !isLoading ? { scale: 0.98 } : {}}
          >
            <span className="flex items-center gap-2">
              {isLoading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    ⏳
                  </motion.span>
                  Generating Guidance...
                </>
              ) : (
                <>🚀 Generate Flowchart</>
              )}
            </span>
          </motion.button>

          {/* Clear Button (PATCH APPLIED) */}
          {problemText && !isLoading && (
            <motion.button
              type="button"
              onClick={handleClear}
              className="
                px-3 py-2
                bg-gray-700 hover:bg-gray-600
                border border-gray-600
                rounded-lg
                text-gray-200 font-semibold text-sm md:text-base
                transition-all duration-200
              "
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-2">✕ Clear</span>
            </motion.button>
          )}
        </div>
        {/* ------------------------------------------------------------ */}

      </form>
    </div>
  );
};

export default ProblemInput;
