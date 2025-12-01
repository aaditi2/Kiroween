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
    <div className="relative h-screen bg-black flex flex-col">
      {/* Spooky Background */}
      <SpookyBackground />


      {/* Fixed Header */}
      <header className="relative z-20 border-b border-purple-900/30 bg-black flex-shrink-0">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-xl">🧠</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text">
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
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Welcome State - Centered */}
          {!flowchart && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-full text-center"
            >
              {/* <div className="mb-8">
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Hi, I'm your coding brainstorm buddy. I help you build logic — one decision at a time without providing code.
                  Ask a coding question below to get started.
                </p>
              </div> */}


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
<footer className="relative z-20 flex-shrink-0 py-6">
  <div className="w-full flex justify-center">

    <form onSubmit={handleSubmit} className="w-2/3 max-w-2xl px-4">
      
      
      <div className="
        flex items-center gap-3
        shadow-[0_0_20px_rgba(128,0,255,0.25)]
        focus-within:ring-0 focus-within:outline-none
      ">

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Send a message…"
          disabled={isLoading}
          className="
                flex-1 bg-transparent text-gray-200 placeholder-gray-500
                text-sm
                border-none outline-none ring-0
                focus:ring-0 focus:outline-none
          "
        />

        {/* Mic + Send grouped on the right */}
        <div className="flex items-center gap-2">

          {/* Mic */}
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-800"
            title="Voice input"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>

          {/* Send */}
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/80 text-black shadow-lg shadow-orange-500/20 transition hover:bg-orange-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Send question"
          >
            {isLoading ? (
              <span className="text-sm">⏳</span>
            ) : (
              <svg
                aria-hidden
                focusable="false"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.75 3.75L20.25 11.25L4.75 18.75L7.75 11.25L4.75 3.75Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.75 11.25H20.25"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>

      </div>

      <p className="mt-2 text-center text-[11px] tracking-[0.25em] text-gray-600">KIROWEEN HACKATHON</p>

    </form>
  </div>
</footer>



    </div>
  );
}


export default App; 