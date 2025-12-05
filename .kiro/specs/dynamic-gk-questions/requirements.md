# Requirements Document

## Introduction

This feature transforms the StudyHinter application's welcome screen from displaying hardcoded example questions to dynamically generating fresh General Knowledge (GK) questions for children using the Gemini AI backend. Each time a user visits or refreshes the main page, they will see new, engaging GK questions suitable for children, making the learning experience more varied and exciting.

## Glossary

- **Frontend**: The React-based user interface of the StudyHinter application (App.jsx)
- **Backend**: The FastAPI Python server that handles AI requests (guidance.py)
- **Gemini AI**: The Google Gemini API used for generating AI content
- **GK Questions**: General Knowledge questions appropriate for children
- **Welcome Screen**: The initial view users see before starting a quiz, currently showing 4 example questions
- **Example Cards**: The clickable question cards displayed on the welcome screen

## Requirements

### Requirement 1

**User Story:** As a child user, I want to see different interesting GK questions each time I visit the app, so that I stay curious and engaged with new topics.

#### Acceptance Criteria

1. WHEN the Frontend loads the welcome screen, THE Frontend SHALL request fresh GK questions from the Backend
2. THE Backend SHALL generate exactly 4 child-appropriate GK questions using Gemini AI
3. THE Frontend SHALL display the generated questions in the existing card layout with emojis and colors
4. WHEN the user refreshes the page, THE Frontend SHALL fetch and display new GK questions

### Requirement 2

**User Story:** As a developer, I want the backend to provide a dedicated endpoint for generating example questions, so that the frontend can easily request fresh questions.

#### Acceptance Criteria

1. THE Backend SHALL expose a new API endpoint at `/api/example-questions`
2. THE Backend SHALL accept GET requests without requiring parameters
3. THE Backend SHALL return a JSON response containing 4 GK questions with emoji, text, and color properties
4. IF the Gemini API fails, THEN THE Backend SHALL return a fallback set of default questions with a warning message

### Requirement 3

**User Story:** As a child user, I want the generated questions to be interesting and varied, so that I learn about different topics.

#### Acceptance Criteria

1. THE Backend SHALL generate questions covering diverse topics such as science, nature, space, animals, and geography
2. THE Backend SHALL ensure each question is phrased simply for children aged 6-12
3. THE Backend SHALL assign appropriate emojis that match each question's topic
4. THE Backend SHALL assign color gradients from a predefined set to ensure visual variety

### Requirement 4

**User Story:** As a user, I want the app to show a loading state while questions are being generated, so that I know the app is working.

#### Acceptance Criteria

1. WHEN the Frontend requests example questions, THE Frontend SHALL display a loading indicator
2. WHILE questions are loading, THE Frontend SHALL show a placeholder or skeleton state for the question cards
3. WHEN questions are successfully loaded, THE Frontend SHALL smoothly transition to displaying the question cards
4. IF loading takes longer than 5 seconds, THEN THE Frontend SHALL display a timeout message and show fallback questions
