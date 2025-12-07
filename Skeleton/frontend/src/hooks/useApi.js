/**
 * Common React hooks for API interactions.
 * Apps can use these hooks or extend them for specific needs.
 */
import { useState, useCallback } from 'react';
import { ApiError } from '../services/BaseApiService';

/**
 * Hook for managing async API calls with loading and error states
 */
export function useAsyncCall() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (asyncFunction) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      return result;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    execute,
    reset,
  };
}

/**
 * Hook for managing flowchart generation
 */
export function useFlowchart(apiService) {
  const [flowchart, setFlowchart] = useState(null);
  const { isLoading, error, execute, reset } = useAsyncCall();

  const generateFlowchart = useCallback(async (problem, options = {}) => {
    const result = await execute(() => apiService.generateFlowchart(problem, options));
    if (result) {
      setFlowchart(result);
    }
    return result;
  }, [apiService, execute]);

  const clearFlowchart = useCallback(() => {
    setFlowchart(null);
    reset();
  }, [reset]);

  return {
    flowchart,
    isLoading,
    error,
    generateFlowchart,
    clearFlowchart,
  };
}

/**
 * Hook for managing step links
 */
export function useStepLinks(apiService) {
  const [links, setLinks] = useState({});
  const [loadingSteps, setLoadingSteps] = useState(new Set());

  const fetchLinksForStep = useCallback(async (stepId, problem, stepTitle, stepDescription) => {
    if (links[stepId] || loadingSteps.has(stepId)) {
      return links[stepId] || [];
    }

    setLoadingSteps(prev => new Set([...prev, stepId]));

    try {
      const result = await apiService.getStepLinks(problem, stepTitle, stepDescription);
      setLinks(prev => ({
        ...prev,
        [stepId]: result.links || [],
      }));
      return result.links || [];
    } catch (error) {
      console.error(`Failed to fetch links for step ${stepId}:`, error);
      return [];
    } finally {
      setLoadingSteps(prev => {
        const newSet = new Set(prev);
        newSet.delete(stepId);
        return newSet;
      });
    }
  }, [apiService, links, loadingSteps]);

  const clearLinks = useCallback(() => {
    setLinks({});
    setLoadingSteps(new Set());
  }, []);

  return {
    links,
    loadingSteps,
    fetchLinksForStep,
    clearLinks,
  };
}