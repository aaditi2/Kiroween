import { motion, AnimatePresence } from 'framer-motion';
import SpookyBackground from './components/SpookyBackground';
import ProblemInput from './components/ProblemInput';
import LoadingSpinner from './components/LoadingSpinner';
import FlowchartView from './components/FlowchartView';
import ErrorFeedback from './components/ErrorFeedback';
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

  const handleSubmit = async (problemText) => {
    await submitProblem(problemText, 'both');
  };

  const handleReset = () => {
    resetFlowchart();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Spooky Background as base layer */}
      <SpookyBackground />

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with title and tagline */}
        <motion.header
          className="relative py-8 px-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-6xl mx-auto text-center">
            {/* LogicHinter Title */}
            <h1 className="text-5xl md:text-6xl mb-3 font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              LogicHinter
            </h1>

            {/* Tagline */}
            <p className="text-lg md:text-xl text-gray-400">
              Your Coding Brainstorm Buddy
            </p>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-6xl">
            <AnimatePresence mode="wait">
              {/* Show ProblemInput when no flowchart exists */}
              {!flowchart && !isLoading && (
                <motion.div
                  key="problem-input"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                >
                  <ProblemInput onSubmit={handleSubmit} isLoading={isLoading} />
                </motion.div>
              )}

              {/* Show LoadingSpinner during API call */}
              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoadingSpinner message="Summoning your guidance..." />
                </motion.div>
              )}

              {/* Show FlowchartView when flowchart data is available */}
              {flowchart && !isLoading && (
                <motion.div
                  key="flowchart"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
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
            </AnimatePresence>
          </div>
        </main>

        {/* Reset/Start-Over Button */}
        <AnimatePresence>
          {(flowchart || error) && !isLoading && (
            <motion.div
              className="fixed bottom-8 right-8 z-50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={handleReset}
                className="
                  px-6 py-3
                  bg-purple-600 hover:bg-purple-700
                  border border-purple-500
                  rounded-lg
                  text-white font-semibold
                  transition-all duration-200
                  shadow-lg
                "
              >
                <span className="flex items-center gap-2">
                  ← Start Over
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State Display */}
        {error && !isLoading && (
          <ErrorFeedback
            message={error}
            onDismiss={clearError}
            isVisible={true}
          />
        )}
      </div>
    </div>
  );
}

export default App;
