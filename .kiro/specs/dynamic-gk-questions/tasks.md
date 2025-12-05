# Implementation Plan

- [ ] 1. Create backend endpoint for dynamic example questions
  - Add new Pydantic models `ExampleQuestion` and `ExampleQuestionsResponse` to guidance.py
  - Define `COLOR_GRADIENTS` list with 8 Tailwind gradient classes
  - Define `FALLBACK_QUESTIONS` list with 8 diverse GK questions
  - Create `example_questions_prompt()` function that generates a prompt for Gemini AI requesting 4 child-appropriate GK questions in JSON format
  - Implement `/api/example-questions` GET endpoint that calls Gemini AI, parses response, assigns random colors, and returns formatted questions
  - Add error handling to return fallback questions if Gemini API fails or API key is missing
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4_

- [x] 2. Update frontend to fetch and display dynamic questions
  - [x] 2.1 Add state management for example questions
    - Add `exampleQuestions` state variable to store fetched questions
    - Add `loadingExamples` state variable to track loading status
    - Define `FALLBACK_QUESTIONS` constant in App.jsx matching backend fallback structure
    - _Requirements: 1.1, 4.1_

  - [x] 2.2 Implement API fetch function
    - Create `fetchExampleQuestions()` async function that calls `/api/example-questions` endpoint
    - Add 5-second timeout to fetch request
    - Implement error handling to use fallback questions on failure
    - Add useEffect hook to call `fetchExampleQuestions()` on component mount
    - _Requirements: 1.1, 1.4, 2.1, 4.4_

  - [x] 2.3 Update UI to render dynamic questions
    - Replace hardcoded question array with `exampleQuestions.map()` in the welcome screen
    - Add loading skeleton or spinner while `loadingExamples` is true
    - Ensure dynamic emoji, text, and color props are used in question cards
    - Verify click handlers still work with dynamic questions
    - _Requirements: 1.3, 4.2, 4.3_

- [ ] 3. Test and validate the implementation
  - Test backend endpoint returns 4 questions with valid structure
  - Test backend returns fallback questions when Gemini API fails
  - Test frontend displays loading state briefly on page load
  - Test frontend renders dynamic questions correctly
  - Test clicking dynamic question cards triggers quiz flow
  - Test page refresh generates new questions
  - Test frontend gracefully handles backend errors with fallback questions
  - _Requirements: 1.1, 1.3, 1.4, 2.3, 2.4, 3.1, 3.2, 4.1, 4.2, 4.3, 4.4_
