import { useState, useCallback } from 'react';
import apiService from '../services/api';

/**
 * Custom hook for managing flowchart state and interactions
 * Handles problem submission, choice selection, and flowchart progression
 */
const useFlowchart = () => {
  // State management
  const [problem, setProblem] = useState(null);
  const [flowchart, setFlowchart] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [selectedChoices, setSelectedChoices] = useState(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  /**
   * Submit a problem to generate a flowchart
   * @param {string} problemText - The coding problem description
   * @param {string} approach - The approach type: 'naive', 'optimized', or 'both'
   */
  const submitProblem = useCallback(async (problemText, approach = 'both') => {
    // Reset state
    setError(null);
    setIsLoading(true);
    setFlowchart(null);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setSelectedChoices(new Map());
    setShowSuccess(false);

    try {
      // Call API to generate flowchart
      const flowchartData = await apiService.generateFlowchart(problemText, approach);

      // Update state with successful response
      setProblem(problemText);
      setFlowchart(flowchartData);
      setCurrentStepIndex(0);
      setError(null);
    } catch (err) {
      // Handle errors
      const errorMessage = err.message || 'Failed to generate flowchart. Please try again.';
      setError(errorMessage);
      setFlowchart(null);
      setProblem(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Select a choice for the current step
   * @param {string} stepId - The ID of the current step
   * @param {string} choiceId - The ID of the selected choice
   */
  const selectChoice = useCallback((stepId, choiceId) => {
    if (!flowchart || !flowchart.steps) {
      setError('No flowchart available');
      return;
    }

    // Get current step
    const currentStep = flowchart.steps[currentStepIndex];
    
    if (!currentStep || currentStep.id !== stepId) {
      setError('Invalid step');
      return;
    }

    // Find the selected option
    const selectedOption = currentStep.options.find(opt => opt.id === choiceId);
    
    if (!selectedOption) {
      setError('Invalid choice');
      return;
    }

    // Update selected choices map
    const newSelectedChoices = new Map(selectedChoices);
    newSelectedChoices.set(stepId, choiceId);
    setSelectedChoices(newSelectedChoices);

    // Check if choice is correct
    if (selectedOption.correct) {
      // Show success animation
      setShowSuccess(true);
      setError(null);

      // Add current step to completed steps
      setCompletedSteps(prev => [...prev, stepId]);

      // Move to next step after a brief delay for animation
      setTimeout(() => {
        setShowSuccess(false);
        
        // Check if there are more steps
        if (currentStepIndex < flowchart.steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          // Flowchart completed
          console.log('Flowchart completed!');
        }
      }, 1500); // 1.5 second delay for success animation
    } else {
      // Show error feedback with explanation
      setError(selectedOption.reason || 'This choice is incorrect. Please try again.');
      setShowSuccess(false);
    }
  }, [flowchart, currentStepIndex, selectedChoices]);

  /**
   * Reset the flowchart to start over
   */
  const resetFlowchart = useCallback(() => {
    setProblem(null);
    setFlowchart(null);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setSelectedChoices(new Map());
    setIsLoading(false);
    setError(null);
    setShowSuccess(false);
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Check if flowchart is completed
   */
  const isCompleted = flowchart && currentStepIndex >= flowchart.steps.length - 1 && 
                      completedSteps.length === flowchart.steps.length;

  /**
   * Get current step data
   */
  const currentStep = flowchart?.steps?.[currentStepIndex] || null;

  /**
   * Get progress percentage
   */
  const progress = flowchart?.steps?.length 
    ? Math.round((completedSteps.length / flowchart.steps.length) * 100)
    : 0;

  return {
    // State
    problem,
    flowchart,
    currentStepIndex,
    completedSteps,
    selectedChoices,
    isLoading,
    error,
    showSuccess,
    
    // Computed values
    currentStep,
    isCompleted,
    progress,
    
    // Actions
    submitProblem,
    selectChoice,
    resetFlowchart,
    clearError,
  };
};

export default useFlowchart;
