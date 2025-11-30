import { motion, AnimatePresence } from 'framer-motion';
import StepNode from './StepNode';
import SuccessAnimation from './SuccessAnimation';
import ErrorFeedback from './ErrorFeedback';

const FlowchartView = ({
  flowchart,
  currentStep,
  currentStepIndex,
  completedSteps,
  showSuccess,
  error,
  isCompleted,
  progress,
  onChoiceSelect,
  onClearError,
}) => {
  const totalSteps = flowchart?.steps?.length || 0;

  return (
    <div className="relative w-full min-h-screen">
      {/* Progress Section */}
      <div className="relative z-10 pt-8 pb-6 px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-center text-2xl md:text-3xl mb-6 text-purple-300 font-semibold">
            Problem Solving Journey
          </h2>

          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden border border-purple-500/20">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-purple-500 to-green-500"
              initial={{ width: '0%' }}
              animate={{
                width: `${progress}%`,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Step Counter */}
          <p className="text-center mt-3 text-sm text-gray-400">
            Step {currentStepIndex + 1} of {totalSteps}
          </p>
        </motion.div>
      </div>

      {/* Completed Steps Indicator */}
      {completedSteps.length > 0 && (
        <div className="relative z-10 px-4 mb-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {completedSteps.map((stepId, i) => (
                <motion.div
                  key={`completed-${stepId}`}
                  className="w-10 h-10 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.3,
                    type: 'spring',
                  }}
                >
                  <span className="text-green-400 text-lg font-bold">✓</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      )}

      {/* Current Step */}
      <div className="relative z-20 px-4 pb-20">
        <AnimatePresence mode="wait">
          {!isCompleted && currentStep && (
            <motion.div
              key={`step-${currentStepIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <StepNode
                step={currentStep}
                onChoiceSelect={onChoiceSelect}
                isActive={true}
                stepNumber={currentStepIndex + 1}
                showChoices={!error && !showSuccess}
              />
            </motion.div>
          )}

          {/* Completion State */}
          {isCompleted && (
            <motion.div
              key="completion"
              className="relative max-w-3xl mx-auto text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <motion.div
                  className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <span className="text-6xl">🎉</span>
                </motion.div>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-green-400 mb-4">
                Journey Complete!
              </h2>

              <p className="text-xl text-gray-300">
                You've successfully navigated through all the steps.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Success Animation */}
      <SuccessAnimation isVisible={showSuccess} />

      {/* Error Feedback */}
      {error && (
        <ErrorFeedback
          message={error}
          onDismiss={onClearError}
          isVisible={true}
        />
      )}
    </div>
  );
};

export default FlowchartView;
