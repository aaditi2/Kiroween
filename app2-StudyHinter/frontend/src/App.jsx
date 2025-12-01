import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpookyBackground from './components/SpookyBackground';
import LoadingSpinner from './components/LoadingSpinner';
import QuizView from './components/QuizView';
import './App.css';
import './styles/spooky.css';

function App() {
  const [topic, setTopic] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredSteps, setAnsweredSteps] = useState([]);
  
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [quiz, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      setIsLoading(true);
      setError(null);
      setQuiz(null);
      setCurrentStepIndex(0);
      setScore(0);
      setAnsweredSteps([]);

      try {
        const response = await fetch('http://localhost:8000/api/flowchart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ problem: topic.trim() }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate quiz');
        }

        const data = await response.json();
        
        if (data.warning) {
          setError(data.warning);
        }
        
        if (data.steps && data.steps.length > 0) {
          setQuiz(data);
        } else {
          setError('No quiz questions were generated. Please try a different topic.');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAnswer = (stepId, optionId, isCorrect) => {
    if (answeredSteps.includes(stepId)) return;

    setAnsweredSteps([...answeredSteps, stepId]);
    
    if (isCorrect) {
      setScore(score + 1);
    }

    // Move to next question after a delay
    setTimeout(() => {
      if (currentStepIndex < quiz.steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      }
    }, 2000);
  };

  const handleReset = () => {
    setTopic('');
    setQuiz(null);
    setError(null);
    setCurrentStepIndex(0);
    setScore(0);
    setAnsweredSteps([]);
    inputRef.current?.focus();
  };

  const isQuizComplete = quiz && currentStepIndex >= quiz.steps.length - 1 && answeredSteps.length === quiz.steps.length;

  return (
    <div className="relative h-screen overflow-hidden bg-black flex flex-col">
      {/* Spooky Background */}
      <SpookyBackground />

      {/* Fixed Header */}
      <header className="relative z-20 border-b border-orange-900/30 bg-black/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-purple-700 flex items-center justify-center shadow-lg shadow-orange-500/30 transform rotate-3">
              <span className="text-2xl">🎃</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text">
                StudyHinter
              </h1>
              <p className="text-xs text-gray-500">Learn with spooky fun quizzes!</p>
            </div>
          </div>
          
          {quiz && (
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-lg bg-purple-900/30 border border-purple-700/50">
                <span className="text-purple-300 font-semibold">
                  🌟 Score: {score}/{quiz.steps.length}
                </span>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 transition-colors"
              >
                New Quiz
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Scrollable Content Area */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Welcome State */}
          {!quiz && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="mb-8">
                <motion.div 
                  className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-orange-600 to-purple-700 flex items-center justify-center shadow-2xl shadow-orange-500/40"
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <span className="text-6xl">🎃</span>
                </motion.div>
                <h2 className="text-4xl font-bold text-orange-300 mb-4" style={{ fontFamily: "'Creepster', cursive" }}>
                  Welcome to StudyHinter!
                </h2>
                <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
                  Enter any topic below and I'll create a fun, spooky quiz with pictures to help you learn! 
                  Perfect for curious minds who love a little mystery! 👻
                </p>
              </div>

              {/* Example topics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl mb-8">
                {[
                  { emoji: '🌍', text: 'How do volcanoes work?' },
                  { emoji: '🦕', text: 'What happened to the dinosaurs?' },
                  { emoji: '🌙', text: 'Why does the moon change shape?' },
                  { emoji: '🌊', text: 'How do ocean waves form?' },
                ].map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setTopic(example.text)}
                    className="p-4 text-left bg-gray-900/50 hover:bg-gray-800/50 border-2 border-orange-800/30 hover:border-orange-600/50 rounded-xl text-gray-300 transition-all transform hover:scale-105"
                  >
                    <span className="text-2xl mr-3">{example.emoji}</span>
                    <span className="text-base">{example.text}</span>
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
              <LoadingSpinner message="Creating your spooky quiz..." />
            </motion.div>
          )}

          {/* Quiz View */}
          {quiz && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <QuizView
                quiz={quiz}
                currentStepIndex={currentStepIndex}
                answeredSteps={answeredSteps}
                score={score}
                onAnswer={handleAnswer}
                isComplete={isQuizComplete}
              />
            </motion.div>
          )}

          {/* Error Display */}
          {error && !quiz && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <div className="p-6 bg-red-900/20 border-2 border-red-800/50 rounded-xl">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">⚠️</span>
                  <div>
                    <h3 className="text-red-400 font-semibold mb-1 text-lg">Oops!</h3>
                    <p className="text-gray-300">{error}</p>
                    <button
                      onClick={() => setError(null)}
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
      <footer className="relative z-20 border-t border-orange-900/30 bg-black/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What do you want to learn about? 🎃"
                disabled={isLoading}
                className="
                  flex-1 px-6 py-4 
                  bg-gray-900 
                  border-2 border-orange-800/30 
                  focus:border-orange-600
                  rounded-xl
                  text-gray-200 text-lg
                  placeholder-gray-500
                  transition-all duration-200
                  focus:outline-none
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              />
              <button
                type="submit"
                disabled={!topic.trim() || isLoading}
                className="
                  px-8 py-4
                  bg-gradient-to-r from-orange-600 to-purple-600
                  hover:from-orange-500 hover:to-purple-500
                  disabled:from-gray-700 disabled:to-gray-800
                  rounded-xl
                  text-white font-bold text-lg
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-lg shadow-orange-500/20
                "
              >
                {isLoading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block text-2xl"
                  >
                    🎃
                  </motion.span>
                ) : (
                  <span className="text-2xl">→</span>
                )}
              </button>
            </div>
          </form>
          
          <p className="text-center text-xs text-gray-600 mt-3">
            StudyHinter creates fun quizzes with real pictures to help you learn! 🌟
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
