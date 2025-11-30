# Requirements Document

## Introduction

LogicHinter is an interactive web application designed to help students learn problem-solving approaches for coding challenges from platforms like LeetCode and HackerRank. The system guides users through a step-by-step approach using AI-generated flowcharts with interactive multiple-choice questions at each step, providing immediate feedback on incorrect choices.

## Glossary

- **LogicHinter System**: The complete web application including frontend and backend components
- **Problem Input**: The coding problem text that a user pastes into the system
- **Approach Flowchart**: A visual step-by-step breakdown of how to solve a coding problem
- **Step Node**: An individual step in the approach flowchart
- **Choice Option**: One of three possible next steps presented to the user at each Step Node
- **Error Feedback**: An explanation shown when a user selects an incorrect Choice Option
- **Gemini AI Service**: The backend service that interfaces with Google's Gemini API
- **Frontend Application**: The React-based user interface built with Vite and Framer Motion
- **Backend Service**: The Python-based API server that processes requests and communicates with Gemini AI

## Requirements

### Requirement 1

**User Story:** As a student, I want to paste a coding problem into the application, so that I can receive guided help on solving it.

#### Acceptance Criteria

1. THE Frontend Application SHALL provide a text input area where users can paste coding problem descriptions
2. WHEN a user submits a problem, THE Frontend Application SHALL send the problem text to the Backend Service
3. THE Backend Service SHALL validate that the submitted problem text is not empty
4. IF the problem text is empty, THEN THE Backend Service SHALL return an error message to the Frontend Application
5. THE Frontend Application SHALL display a loading indicator while the problem is being processed

### Requirement 2

**User Story:** As a student, I want the system to generate an approach flowchart for my problem, so that I can understand the solution methodology step by step.

#### Acceptance Criteria

1. WHEN the Backend Service receives a valid problem, THE Gemini AI Service SHALL generate a structured approach flowchart with multiple steps
2. THE Gemini AI Service SHALL format each Step Node with a description and exactly three Choice Options
3. THE Gemini AI Service SHALL designate one Choice Option as correct and two as incorrect for each Step Node
4. THE Gemini AI Service SHALL include explanations for why each incorrect Choice Option is wrong
5. THE Backend Service SHALL return the complete flowchart data structure to the Frontend Application within 30 seconds

### Requirement 3

**User Story:** As a student, I want to see the approach flowchart visually, so that I can easily understand the problem-solving flow.

#### Acceptance Criteria

1. WHEN the Frontend Application receives flowchart data, THE Frontend Application SHALL render the flowchart visually using animated components
2. THE Frontend Application SHALL use Framer Motion to animate transitions between Step Nodes
3. THE Frontend Application SHALL display the current Step Node with its three Choice Options clearly visible
4. THE Frontend Application SHALL highlight the user's selected Choice Option before proceeding
5. THE Frontend Application SHALL maintain a visual history of completed steps

### Requirement 4

**User Story:** As a student, I want to select options at each step and receive feedback, so that I can learn from my mistakes and understand the correct approach.

#### Acceptance Criteria

1. WHEN a user clicks on a Choice Option, THE Frontend Application SHALL register the selection
2. IF the selected Choice Option is incorrect, THEN THE Frontend Application SHALL display an error box with the explanation
3. THE Frontend Application SHALL prevent progression to the next Step Node when an incorrect Choice Option is selected
4. WHEN a user selects the correct Choice Option, THE Frontend Application SHALL advance to the next Step Node
5. THE Frontend Application SHALL allow users to retry after viewing error feedback

### Requirement 5

**User Story:** As a system administrator, I want the backend to securely manage API credentials, so that the Gemini API key is protected.

#### Acceptance Criteria

1. THE Backend Service SHALL store the Gemini API key in a configuration file that is excluded from version control
2. THE Backend Service SHALL load API credentials from environment variables or a secure configuration module
3. THE Backend Service SHALL encrypt sensitive data in transit using HTTPS
4. THE Backend Service SHALL validate API requests to prevent unauthorized access
5. IF API credentials are missing or invalid, THEN THE Backend Service SHALL log an error and refuse to start

### Requirement 6

**User Story:** As a developer, I want the frontend and backend to communicate via a REST API, so that the system components are decoupled and maintainable.

#### Acceptance Criteria

1. THE Backend Service SHALL expose a REST API endpoint for submitting coding problems
2. THE Backend Service SHALL accept POST requests with JSON payloads containing problem text
3. THE Backend Service SHALL return JSON responses with flowchart data or error messages
4. THE Frontend Application SHALL handle network errors gracefully and display user-friendly messages
5. THE Backend Service SHALL include CORS headers to allow requests from the Frontend Application domain
