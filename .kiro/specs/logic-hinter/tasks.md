# Implementation Plan

- [x] 1. Set up backend project structure and configuration
  - Create backend directory with Python virtual environment
  - Create config.py with Config class that loads environment variables and validates required settings
  - Create .env.example file with GEMINI_API_KEY, API_HOST, API_PORT, CORS_ORIGINS placeholders
  - Create requirements.txt with dependencies: flask/fastapi, google-generativeai, python-dotenv, flask-cors/fastapi-cors, cryptography
  - Create .gitignore for Python (include .env, __pycache__, venv)
  - _Requirements: 5.1, 5.2, 5.4, 5.5_

- [x] 2. Implement crypto utilities module
  - Create crypto.py with functions for data sanitization and security utilities
  - Implement sanitize_input() function to clean user input text
  - Implement generate_session_token() for future session management
  - _Requirements: 5.3_

- [x] 3. Implement Gemini AI client
  - Create gemini_client.py with GeminiClient class
  - Implement __init__ method to initialize Gemini AI SDK with API key
  - Implement _build_prompt() method that constructs a detailed prompt for flowchart generation with specific JSON format instructions
  - Implement _parse_response() method to extract and parse JSON flowchart data from AI response
  - Implement _validate_flowchart() method to ensure response has correct structure (steps array, choices with correct/explanation fields)
  - Implement generate_flowchart() method that orchestrates prompt building, API call, parsing, and validation
  - Add error handling for API failures with retry logic (max 3 attempts)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 4. Create data models for flowchart structure
  - Create models/flowchart.py with dataclasses or Pydantic models for Choice and Step
  - Define Choice model with id, text, correct, and explanation fields
  - Define Step model with id, description, and choices list
  - Define Flowchart model with steps list
  - Add validation methods to ensure data integrity
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 5. Implement backend API routes
  - Create app.py with Flask/FastAPI application initialization
  - Configure CORS with allowed origins from config
  - Create routes/api.py with route handlers
  - Implement POST /api/generate endpoint that accepts problem text, validates input, calls GeminiClient, and returns flowchart JSON
  - Implement GET /api/health endpoint for health checks
  - Add request validation for empty or too-long problem text
  - Add error handlers for 400, 500, 503 status codes
  - _Requirements: 1.2, 1.3, 1.4, 6.1, 6.2, 6.3, 6.5_

- [ ] 6. Add backend input validation and error handling
  - Create utils/validators.py with validation functions
  - Implement validate_problem_text() to check for empty input and reasonable length limits
  - Add comprehensive error handling in API routes for Gemini API failures, timeouts, and validation errors
  - Implement timeout mechanism (30 seconds) for Gemini API calls
  - _Requirements: 1.3, 1.4, 2.5_

- [ ]* 6.1 Write unit tests for backend core functionality
  - Write tests for GeminiClient with mocked Gemini API responses
  - Write tests for crypto.py sanitization functions
  - Write tests for config.py validation logic
  - Write tests for validators.py functions
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.1, 5.2_

- [x] 7. Set up frontend project with Vite and React
  - Create frontend directory using `npm create vite@latest` with React template
  - Install dependencies: framer-motion, axios, react-router-dom (if needed)
  - Configure vite.config.js with proxy for backend API during development
  - Create .env.example with VITE_API_URL placeholder
  - Update .gitignore for Node.js (include .env, node_modules, dist)
  - Set up basic folder structure: components/, hooks/, services/, utils/, styles/, types/
  - _Requirements: 6.4_

- [ ] 8. Implement frontend API service
  - Create services/api.js with ApiService class
  - Implement generateFlowchart() method that sends POST request to /api/generate with problem text
  - Implement healthCheck() method for backend health verification
  - Add error handling for network failures and invalid responses
  - Add request timeout configuration
  - _Requirements: 1.2, 6.2, 6.3, 6.4_

- [ ] 9. Create flowchart state management hook
  - Create hooks/useFlowchart.js custom hook
  - Implement state management for: problem, flowchart, currentStepIndex, completedSteps, selectedChoices, isLoading, error
  - Implement submitProblem() function that calls API and updates state
  - Implement selectChoice() function that validates choice and updates currentStepIndex or shows error
  - Implement resetFlowchart() function to start over
  - _Requirements: 1.2, 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 10. Build ProblemInput component
  - Create components/ProblemInput.jsx with textarea and submit button
  - Add character count display and validation
  - Implement loading state during submission
  - Add clear button to reset textarea
  - Style with responsive design
  - _Requirements: 1.1, 1.2, 1.5_

- [ ] 11. Build LoadingSpinner component
  - Create components/LoadingSpinner.jsx with animated spinner
  - Use Framer Motion for smooth rotation animation
  - Add loading message text
  - _Requirements: 1.5_

- [ ] 12. Build ErrorFeedback component
  - Create components/ErrorFeedback.jsx for displaying error messages
  - Implement modal/toast design with error explanation text
  - Add dismiss button and retry functionality
  - Use Framer Motion for slide-in/fade-in animations
  - Add auto-dismiss option after 5 seconds (optional)
  - _Requirements: 4.2, 4.5_

- [ ] 13. Build ChoiceButton component
  - Create components/ChoiceButton.jsx for individual choice options
  - Implement three visual states: default, selected, disabled
  - Add hover animations using Framer Motion
  - Add click handler that triggers parent callback
  - Style with clear visual hierarchy
  - _Requirements: 4.1_

- [ ] 14. Build StepNode component
  - Create components/StepNode.jsx to display a single flowchart step
  - Render step description and step number/progress indicator
  - Render three ChoiceButton components for each choice
  - Implement entry/exit animations using Framer Motion
  - Handle choice selection and pass to parent
  - _Requirements: 3.3, 3.4, 4.1_

- [ ] 15. Build FlowchartView component
  - Create components/FlowchartView.jsx as main flowchart container
  - Implement logic to render current StepNode based on currentStepIndex
  - Display visual history/breadcrumb of completed steps
  - Handle choice selection and validation (correct vs incorrect)
  - Show ErrorFeedback component when incorrect choice is selected
  - Implement step progression with Framer Motion transitions
  - Add completion state when all steps are finished
  - _Requirements: 3.1, 3.2, 3.5, 4.2, 4.3, 4.4_

- [ ] 16. Create animation utilities
  - Create utils/animations.js with Framer Motion animation variants
  - Define variants for: stepEntry, stepExit, choiceHover, errorSlideIn, fadeIn
  - Export reusable animation configurations
  - _Requirements: 3.2_

- [ ] 17. Build main App component and integrate all pieces
  - Update App.jsx to manage application state using useFlowchart hook
  - Conditionally render ProblemInput when no flowchart exists
  - Conditionally render LoadingSpinner during API call
  - Conditionally render FlowchartView when flowchart data is available
  - Handle error states and display error messages
  - Add reset/start-over functionality
  - _Requirements: 1.1, 1.2, 1.5, 3.1, 6.4_

- [ ] 18. Add global styles and responsive design
  - Create styles/index.css with global styles and CSS variables
  - Implement responsive layout for mobile, tablet, and desktop
  - Add consistent color scheme and typography
  - Ensure accessibility (focus states, ARIA labels, keyboard navigation)
  - _Requirements: 3.3, 3.4_

- [ ]* 19. Write frontend component tests
  - Write tests for ProblemInput component (input validation, submission)
  - Write tests for ChoiceButton component (click handling, visual states)
  - Write tests for StepNode component (rendering choices, animations)
  - Write tests for FlowchartView component (step progression, error display)
  - Write tests for useFlowchart hook (state management, API integration)
  - _Requirements: 1.1, 1.2, 4.1, 4.2, 4.3, 4.4_

- [ ] 20. Integration testing and end-to-end validation
  - Test complete user flow: paste problem → receive flowchart → make choices → complete or retry
  - Verify error handling for network failures and invalid inputs
  - Test with various problem types and lengths
  - Verify animations and transitions work smoothly
  - Test CORS configuration between frontend and backend
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.5, 4.1, 4.2, 4.3, 4.4, 4.5, 6.3, 6.4, 6.5_
