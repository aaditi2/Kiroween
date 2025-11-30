import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpookyBackground from './components/SpookyBackground';
import LoadingSpinner from './components/LoadingSpinner';
import FlowchartView from './components/FlowchartView';
import useFlowchart from './hooks/useFlowchart';
import './App.css';
import './styles/spooky.css';

function App() {
  const {
    flowchart,
    currentStep,
    currentStepIndex,
    completedSteps,
    selectedChoices,
    isLoading,
    error,
    showSuccess,
    isCompleted,
    progress,
    submitProblem,
    selectChoice,
    resetFlowchart,
    clearError,
  } = useFlowchart();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [flowchart, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      await submitProblem(inputValue.trim(), 'both');
      setInputValue('');
    }
  };

  const handleReset = () => {
    resetFlowchart();
    setInputValue('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative h-screen overflow-hidden bg-black flex flex-col">
      {/* Spooky Background */}
      <SpookyBackground />

      {/* Fixed Header */}
      <header className="relative z-20 border-b border-purple-900/30 bg-black/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-xl">🧠</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
                LogicHinter
              </h1>
              <p className="text-xs text-gray-500">AI that helps you learn how to code, not copy</p>
            </div>
          </div>
          
          {flowchart && (
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 transition-colors"
            >
              New Problem
            </button>
          )}
        </div>
      </header>

      {/* Scrollable Content Area */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Welcome State */}
          {!flowchart && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                  <span className="text-4xl">🧠</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-200 mb-3">
                  Welcome to LogicHinter
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Your AI-powered coding mentor that guides you through problem-solving with interactive flowcharts.
                  Ask a coding question below to get started.
                </p>
              </div>

              {/* Example prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl">
                {[
                  'How do I reverse a linked list?',
                  'Explain binary search algorithm',
                  'What\'s the best way to find duplicates in an array?',
                  'How to implement a stack using queues?',
                ].map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setInputValue(example)}
                    className="p-4 text-left bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-purple-700/50 rounded-lg text-gray-300 text-sm transition-all"
                  >
                    <span className="text-purple-400 mr-2">→</span>
                    {example}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12"
            >
              <LoadingSpinner message="Analyzing your problem..." />
            </motion.div>
          )}

          {/* Flowchart Response */}
          {flowchart && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FlowchartView
                flowchart={flowchart}
                currentStep={currentStep}
                currentStepIndex={currentStepIndex}
                completedSteps={completedSteps}
                selectedChoices={selectedChoices}
                showSuccess={showSuccess}
                error={error}
                isCompleted={isCompleted}
                progress={progress}
                onChoiceSelect={selectChoice}
                onClearError={clearError}
              />
            </motion.div>
          )}

          {/* Error Display */}
          {error && !flowchart && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <div className="p-6 bg-red-900/20 border border-red-800/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h3 className="text-red-400 font-semibold mb-1">Error</h3>
                    <p className="text-gray-300">{error}</p>
                    <button
                      onClick={clearError}
                      className="mt-3 text-sm text-red-400 hover:text-red-300 underline"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Fixed Input Bar at Bottom */}
      <footer className="relative z-20 border-t border-purple-900/30 bg-black/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a coding question..."
                disabled={isLoading}
                className="
                  flex-1 px-5 py-4 
                  bg-gray-900 
                  border-2 border-gray-800 
                  focus:border-purple-600
                  rounded-xl
                  text-gray-200 text-base
                  placeholder-gray-500
                  transition-all duration-200
                  focus:outline-none
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="
                  px-6 py-4
                  bg-gradient-to-r from-purple-600 to-purple-700
                  hover:from-purple-500 hover:to-purple-600
                  disabled:from-gray-700 disabled:to-gray-800
                  rounded-xl
                  text-white font-semibold
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-lg shadow-purple-500/20
                "
              >
                {isLoading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block"
                  >
                    ⏳
                  </motion.span>
                ) : (
                  <span>→</span>
                )}
              </button>
            </div>
          </form>
          
          <p className="text-center text-xs text-gray-600 mt-3">
            LogicHinter guides you through problem-solving. It won't give you the code, but it'll help you think through it.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
