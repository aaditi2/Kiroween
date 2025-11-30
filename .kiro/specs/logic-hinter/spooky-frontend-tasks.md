# Spooky Frontend Implementation Plan
## Costume Contest - Haunting UI for LogicHinter

**Theme:** A mystical coding brainstorm buddy that helps students *think*, not copy. Dark, atmospheric, and engaging.

---

- [x] 1. Set up spooky design foundation
  - Configure Tailwind CSS with custom dark theme colors (deep blacks, purple accents, eerie greens)
  - Add spooky Google Fonts to index.html: "Creepster" for headers, "Space Mono" for body text
  - Create styles/spooky.css with custom CSS variables for glow effects, shadows, and fog animations
  - Define color palette: background blacks (#0a0a0a), neon purple (#a855f7), eerie green (#10b981), blood red (#ef4444)
  - Set up global CSS animations: floating, pulsing glow, fog movement, particle drift
  - _Requirements: 3.3, 3.4_

- [x] 2. Create SpookyBackground component
  - Create components/SpookyBackground.jsx with layered atmospheric effects
  - Implement animated fog/mist layers using CSS animations and gradients
  - Add floating particles (fireflies, embers, or spirits) using Framer Motion
  - Create subtle cobweb SVG overlays in corners
  - Add vignette effect (darker edges) for depth
  - Implement parallax scrolling for background layers
  - Add starry night sky or haunted forest backdrop
  - _Requirements: 3.1, 3.2_

- [x] 3. Build haunted ProblemInput component
  - Create components/ProblemInput.jsx with dark, mystical styling
  - Style textarea with glowing purple/green border on focus
  - Add floating placeholder text with eerie fade animation
  - Create submit button styled as mystical tome or cauldron with hover glow effect
  - Implement ghostly character count that fades in/out
  - Add fog effect around input area using CSS pseudo-elements
  - Implement pulsing glow effect when user is typing
  - Add "Clear" button styled as "Banish Text" with red glow
  - _Requirements: 1.1, 1.2, 1.5_

- [x] 4. Build mystical LoadingSpinner component
  - Create components/LoadingSpinner.jsx with haunting animation
  - Design spinning element: skull, cauldron, or mystical rune circle
  - Add glowing particles orbiting the spinner using Framer Motion
  - Implement pulsing glow effect with color transitions
  - Add spooky loading text: "Summoning your guidance..." or "Consulting the spirits..."
  - Create fog swirling animation around spinner
  - Add ethereal color transitions (purple to green)
  - _Requirements: 1.5_

- [x] 5. Build ghostly ErrorFeedback component
  - Create components/ErrorFeedback.jsx styled as ghost or phantom
  - Implement emergence animation from shadows (fade + slide from bottom)
  - Style with red/orange glowing text for error message
  - Add floating/hovering effect using Framer Motion
  - Create wispy smoke or fog trails around the error box
  - Style dismiss button as "Banish" or "I Understand" with dark styling
  - Add backdrop blur/darken effect when error appears
  - Implement shaking or trembling animation for emphasis
  - _Requirements: 4.2, 4.5_

- [x] 6. Build SuccessAnimation component
  - Create components/SuccessAnimation.jsx for correct choice celebration
  - Implement mystical sparkles or magical energy burst effect
  - Add brief screen flash with green/gold glow
  - Create floating runes or symbols animation
  - Keep animation quick (1-2 seconds) and thematic
  - Use Framer Motion for particle dispersal effect
  - _Requirements: 4.4_

- [x] 7. Build spooky ChoiceButton component
  - Create components/ChoiceButton.jsx styled as potion bottles, coffins, or spell books
  - Assign different colored glows for each option (purple, green, red/orange)
  - Implement hover effect: intensified glow + slight levitation (scale 1.05)
  - Add click effect: magical sparkles or dark energy burst
  - Create selected state with bright pulsing glow animation
  - Implement wrong choice animation: cracking/shattering effect
  - Implement correct choice animation: triumphant glow burst
  - Add eerie shadows and 3D depth with box-shadow
  - Ensure accessibility with focus states and ARIA labels
  - _Requirements: 4.1_

- [x] 8. Build tombstone/crystal ball StepNode component
  - Create components/StepNode.jsx styled as tombstone, crystal ball, or ancient scroll
  - Add glowing runes or mystical symbols as decorative elements
  - Implement ethereal entrance animation (fade from mist) using Framer Motion
  - Create pulsing glow around active step
  - Use creepy typography (Creepster font) for step description
  - Add floating animation (gentle hover effect, 2-4s loop)
  - Implement shadow effects and depth with layered shadows
  - Display step number as mystical rune or glowing number
  - _Requirements: 3.3, 3.4, 4.1_

- [x] 9. Build graveyard-themed FlowchartView component
  - Create components/FlowchartView.jsx with graveyard/haunted forest theme
  - Implement path of tombstones representing completed steps
  - Add fog rolling across the screen using CSS animations
  - Display current StepNode with spotlight/glow effect
  - Create visual history as a winding path through darkness
  - Handle choice selection and trigger SuccessAnimation or ErrorFeedback
  - Implement step progression with mystical transition effects
  - Add completion state with mystical celebration (glowing portal or achievement)
  - Show progress indicator as "Journey through the darkness" with visual path
  - _Requirements: 3.1, 3.2, 3.5, 4.2, 4.3, 4.4_

- [ ] 10. Create spooky animation utilities
  - Create utils/animations.js with Framer Motion variants for all spooky effects
  - Define fadeFromMist: slow fade-in with scale and opacity
  - Define floatingGhost: gentle up/down movement (infinite loop)
  - Define pulsingGlow: opacity and scale pulse for glowing elements
  - Define shatterEffect: scale down + rotate + opacity for wrong choices
  - Define energyBurst: scale up + opacity for correct choices
  - Define slideFromShadows: slide from bottom with fade for errors
  - Define levitate: slight scale and y-axis movement on hover
  - Export all variants as reusable configurations
  - _Requirements: 3.2_

- [x] 11. Implement frontend API service
  - Create services/api.js with ApiService class
  - Implement generateFlowchart() method with POST request to backend /api/generate
  - Add error handling for network failures with user-friendly messages
  - Add request timeout configuration (30 seconds)
  - Implement response validation to ensure flowchart structure is correct
  - _Requirements: 1.2, 6.2, 6.3, 6.4_

- [x] 12. Create flowchart state management hook
  - Create hooks/useFlowchart.js custom hook
  - Implement state: problem, flowchart, currentStepIndex, completedSteps, selectedChoices, isLoading, error, showSuccess
  - Implement submitProblem() function that calls API and updates state
  - Implement selectChoice() function that validates choice, triggers success/error, and updates currentStepIndex
  - Implement resetFlowchart() function to start over
  - Add logic to track completed steps for visual history
  - _Requirements: 1.2, 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 13. Build main App component with spooky layout
  - Update App.jsx with dark, atmospheric layout
  - Add SpookyBackground as base layer
  - Implement state management using useFlowchart hook
  - Conditionally render ProblemInput when no flowchart exists
  - Conditionally render LoadingSpinner during API call
  - Conditionally render FlowchartView when flowchart data is available
  - Add header with spooky title: "LogicHinter" with glowing effect and tagline "Your Coding Brainstorm Buddy"
  - Add reset/start-over button styled as "Return to the Beginning" with mystical styling
  - Handle error states and display error messages
  - Ensure smooth transitions between all states
  - _Requirements: 1.1, 1.2, 1.5, 3.1, 6.4_

- [ ] 14. Polish spooky UI and add final touches
  - Fine-tune all glow effects, shadows, and animations for consistency
  - Ensure responsive design works on mobile, tablet, and desktop
  - Add subtle sound effects (optional): ambient background, click sounds, error sounds
  - Implement custom cursor (mystical pointer) for interactive elements
  - Add loading transitions between all states
  - Ensure all text is readable with proper contrast
  - Add accessibility features: keyboard navigation, screen reader support, focus indicators
  - Add meta tags and favicon with spooky theme
  - _Requirements: 3.3, 3.4_

- [ ] 15. Create demo content and final testing
  - Test with sample coding problems to ensure flowchart generation works
  - Verify all spooky animations trigger correctly
  - Test error handling with network failures and invalid inputs
  - Ensure CORS is configured correctly between frontend and backend
  - Test complete user flow: input → loading → flowchart → choices → completion
  - Verify responsive design on different screen sizes
  - Check accessibility compliance
  - Prepare demo for competition showcase
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.5, 4.1, 4.2, 4.3, 4.4, 4.5, 6.3, 6.4, 6.5_
