import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpookyBackground from './components/SpookyBackground';
import LoadingSpinner from './components/LoadingSpinner';
import QuizView from './components/QuizView';
import './App.css';
import './styles/spooky.css';
import './styles/index.css';

// Fallback questions in case API fails
const FALLBACK_QUESTIONS = [
  { emoji: '🌋', text: 'How do volcanoes erupt?', color: 'from-red-600 to-orange-600' },
  { emoji: '🦕', text: 'What happened to dinosaurs?', color: 'from-green-600 to-teal-600' },
  { emoji: '🌙', text: 'Why does the moon glow?', color: 'from-blue-600 to-purple-600' },
  { emoji: '🌊', text: 'How do ocean waves work?', color: 'from-cyan-600 to-blue-600' },
];

// Helper function to validate and sanitize emoji
const validateEmoji = (emoji) => {
  if (!emoji || typeof emoji !== 'string') return '❓';
  
  // Check for corrupted text (like Cyrillic characters that shouldn't be emojis)
  const corruptedTextRegex = /[а-яё]/i; // Cyrillic characters
  const hasCorruptedText = corruptedTextRegex.test(emoji);
  
  // If it contains corrupted text or is suspiciously long, return default
  if (hasCorruptedText || emoji.length > 8) {
    return '🔮'; // Default magical emoji
  }
  
  return emoji;
};

// Helper function to validate example question data
const validateExampleQuestion = (example, index) => {
  const fallbackColors = [
    'from-red-600 to-orange-600',
    'from-green-600 to-teal-600', 
    'from-blue-600 to-purple-600',
    'from-cyan-600 to-blue-600'
  ];
  
  return {
    emoji: validateEmoji(example?.emoji),
    text: example?.text || `Question ${index + 1}`,
    color: example?.color || fallbackColors[index % fallbackColors.length]
  };
};

function App() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('below_grade_6'); // New state for difficulty
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredSteps, setAnsweredSteps] = useState([]);
  const [exampleQuestions, setExampleQuestions] = useState(FALLBACK_QUESTIONS);
  const [loadingExamples, setLoadingExamples] = useState(true);
  
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [quiz, isLoading]);

  // Fetch example questions on component mount
  useEffect(() => {
    const fetchExampleQuestions = async () => {
      setLoadingExamples(true);
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('http://localhost:8000/api/example-questions', {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error('Failed to fetch example questions');
        }

        const data = await response.json();
        
        if (data.questions && data.questions.length > 0) {
          setExampleQuestions(data.questions);
        } else {
          setExampleQuestions(FALLBACK_QUESTIONS);
        }
      } catch (err) {
        console.error('Failed to fetch example questions:', err);
        setExampleQuestions(FALLBACK_QUESTIONS);
      } finally {
        setLoadingExamples(false);
      }
    };

    fetchExampleQuestions();
  }, []);

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
          body: JSON.stringify({ problem: topic.trim(), difficulty: difficulty }),
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
    <div className="h-screen flex flex-col relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #2d1b4e 0%, #4a2b6e 50%, #2d1b4e 100%)' }}>
      {/* Spooky Background */}
      <SpookyBackground />

      {/* Floating Ghosts Animation */}
      <div className="fixed inset-0 pointer-events-none z-5">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`ghost-${i}`}
            className="absolute text-6xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            👻
          </motion.div>
        ))}
      </div>

      {/* Sticky Header - Haunted House Style */}
      <header className="sticky top-0 bg-gradient-to-r from-purple-900/90 to-indigo-900/90 backdrop-blur-md shadow-2xl" style={{ zIndex: 100 }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between border-b-4 border-orange-500/50" style={{ paddingLeft: '2rem', paddingRight: '1.5rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
          <div className="flex items-center gap-4">
            
            <div>
              <h1 className="text-3xl font-black tracking-wider" style={{ 
                fontFamily: "'Creepster', cursive",
                background: 'linear-gradient(90deg, #ff8c42, #ffd60a, #06ffa5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(255, 140, 66, 0.5)',
                margin: '0',
                lineHeight: '1',

              }}>
                🧙🏻‍♀️QuizCraft
              </h1>
              <p className="text-sm font-bold" style={{ color: '#06ffa5', marginTop: '0.25rem', marginBottom: '0' }}>
                🦇 Learn GK with mistake-based learning. 🕷️
              </p>
            </div>
          </div>
          
          {quiz && (
            <div className="flex items-center gap-4">
              <motion.div 
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-3 border-yellow-400/60 shadow-lg"
                animate={{
                  boxShadow: ['0 0 20px rgba(255, 214, 10, 0.3)', '0 0 40px rgba(255, 214, 10, 0.6)', '0 0 20px rgba(255, 214, 10, 0.3)'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <span className="text-yellow-200 font-black text-lg">
                  ⭐ {score}/{quiz.steps.length} Stars!
                </span>
              </motion.div>
              <button
                onClick={handleReset}
                className="px-6 py-3 text-base font-bold bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 border-2 border-orange-400 rounded-2xl text-white transition-all transform hover:scale-105 shadow-lg"
              >
                🎃 New Quest
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto relative" style={{ zIndex: 1 }}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Welcome State - Haunted House */}
          {!quiz && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="mb-10">
                {/* Haunted House with Floating Animation */}
                <motion.div 
                  className="relative w-48 h-48 mx-auto mb-8"
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >

                  {/* Floating bats */}
                  {[...Array(3)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="absolute text-4xl"
                      style={{
                        left: `${30 + i * 20}%`,
                        top: `${20 + i * 15}%`,
                      }}
                      animate={{
                        x: [0, 20, 0],
                        y: [0, -20, 0],
                        rotate: [0, 10, 0],
                      }}
                      transition={{
                        duration: 2 + i,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    >
                      🦇
                    </motion.span>
                  ))}
                </motion.div>
                
                <h2 className="text-5xl font-black mb-6" style={{ 
                  fontFamily: "'Creepster', cursive",
                  background: 'linear-gradient(90deg, #ff8c42, #ffd60a, #06ffa5, #9d4edd)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 40px rgba(255, 140, 66, 0.6)',
                }}>
                  Welcome to the Haunted Study Hall!
                </h2>
                <p className="text-white text-2xl max-w-3xl mx-auto leading-relaxed font-bold mb-4" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  {/* 🕯️ Enter any topic and I'll conjure up a magical quiz with pictures! 🕯️ */}
                  🔮 Suggested General Knowledge questions for today!✨
                </p>
              </div>

              {/* Example topics - Spooky Cards */}
              <div className="flex flex-col items-center w-full mb-8" style={{ gap: '10px' }}>
                {loadingExamples ? (
                  // Loading skeleton
                  [...Array(4)].map((_, i) => (
                    <motion.div
                      key={`skeleton-${i}`}
                      className="p-3 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border-2 border-yellow-400/30 rounded-xl shadow-lg relative overflow-hidden"
                      style={{ width: '400px' }}
                      animate={{
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-white/20 rounded w-3/4"></div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  // Dynamic questions
                  exampleQuestions.map((example, i) => {
                    // Only validate emoji if it seems corrupted, otherwise use original
                    const safeEmoji = validateEmoji(example.emoji);
                    return (
                      <motion.button
                        key={i}
                        onClick={() => setTopic(example.text)}
                        className={`p-3 text-left bg-gradient-to-br ${example.color} hover:scale-105 border-2 border-yellow-400/60 rounded-xl text-white transition-all shadow-lg relative overflow-hidden`}
                        style={{ width: '400px' }}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="relative flex items-center gap-3">
                          <span className="text-3xl">{safeEmoji}</span>
                          <span className="text-lg font-bold">{example.text}</span>
                        </div>
                      {/* Sparkle effect */}
                      <motion.div
                        className="absolute top-2 right-2 text-2xl"
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      >
                        ✨
                      </motion.div>
                    </motion.button>
                    );
                  })
                )}
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

      {/* Sticky Input Bar at Bottom - ChatGPT Style */}
      <footer className="sticky bottom-0" style={{ zIndex: 100 }}>
  <div className="w-full flex justify-center pb-6">
    <form onSubmit={handleSubmit} className="flex items-start gap-8">
      {/* Main prompt bar container */}
      <div className="bg-gradient-to-r from-purple-900/95 to-indigo-900/95 
                      backdrop-blur-md rounded-3xl shadow-2xl p-5"
           style={{ width: '500px' }}>
        
        <div className="flex items-center gap-3">
          

          {/* Input field container with difficulty buttons INSIDE */}
          <div className="flex-1 bg-black/40 rounded-xl p-3 space-y-2">
            {/* Difficulty buttons at top INSIDE the input bar */}
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] text-gray-400">Difficulty:</span>
              <button
                type="button"
                onClick={() => setDifficulty('below_grade_6')}
                className={`px-2 py-0.5 rounded text-[13px] font-bold transition-all ${
                  difficulty === 'below_grade_6'
                    ? 'bg-green-500 text-white'
                    : 'bg-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                Grade &lt; 6
              </button>
              <button
                type="button"
                onClick={() => setDifficulty('above_grade_6')}
                className={`px-2 py-0.5 rounded text-[13px] font-bold transition-all ${
                  difficulty === 'above_grade_6'
                    ? 'bg-purple-500 text-white'
                    : 'bg-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                Grade 6+
              </button>
            </div>

            {/* Input field below */}
            <input
              ref={inputRef}
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What magical topic shall we explore? 🧙‍♀️✨"
              className="
                w-full
                bg-transparent
                text-white font-bold
                placeholder-purple-300
                px-2 py-2
                focus:outline-bold
                transition
                
              "
              style={{ fontSize: '15px', marginTop: '8px' }}
              
            />
          </div>
        </div>

        <p
          className="text-center font-bold text-green-300"
          style={{ fontSize: "12px", lineHeight: "12px", marginTop: "10px" }}
        >
          KIROWEEN HACKATHON
        </p>
      </div>

      {/* Submit button - now outside and beside the prompt bar */}
      <motion.button
        type="submit"
        disabled={!topic.trim() || isLoading}
        className="
          flex items-center justify-center gap-2
          bg-gradient-to-r from-orange-500 via-red-500 to-pink-500
          hover:from-orange-400 hover:via-red-400 hover:to-pink-400
          rounded-xl text-white font-black text-xl
        "
        style={{ height: "40px", minWidth: "40px", marginLeft: "20px", marginTop: "30px" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-2xl">↳</span>
      </motion.button>
    </form>
  </div>
</footer>

    </div>
  );
}

export default App;
