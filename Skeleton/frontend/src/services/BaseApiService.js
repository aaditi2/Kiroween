/**
 * Base API Service for Skeleton-based apps.
 * Provides common functionality like error handling, timeouts, and validation.
 * Apps should extend this class and add their specific methods.
 */

const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Base API Service class that all skeleton apps should extend
 */
export class BaseApiService {
  constructor(baseURL = null) {
    this.baseURL = baseURL || this._getDefaultBaseURL();
  }

  /**
   * Get the default base URL from environment variables
   * @private
   */
  _getDefaultBaseURL() {
    return import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }

  /**
   * Make a fetch request with timeout and error handling
   * @private
   */
  async _fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new ApiError(
          'Request timed out. The server took too long to respond.',
          408
        );
      }
      throw error;
    }
  }

  /**
   * Handle HTTP response and convert to JSON with error handling
   * @private
   */
  async _handleResponse(response) {
    if (!response.ok) {
      let errorMessage = 'Request failed';
      let errorData = null;

      try {
        errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }

      throw new ApiError(errorMessage, response.status, errorData);
    }

    return await response.json();
  }

  /**
   * Validate flowchart structure (common across apps)
   * @protected
   */
  _validateFlowchart(flowchart) {
    if (!flowchart || typeof flowchart !== 'object') {
      throw new Error('Invalid flowchart: must be an object');
    }

    if (!Array.isArray(flowchart.steps)) {
      throw new Error('Invalid flowchart: steps must be an array');
    }

    flowchart.steps.forEach((step, index) => {
      if (!step.id || typeof step.id !== 'string') {
        throw new Error(`Invalid step at index ${index}: missing or invalid id`);
      }

      if (!step.title || typeof step.title !== 'string') {
        throw new Error(`Invalid step at index ${index}: missing or invalid title`);
      }

      if (!Array.isArray(step.options) || step.options.length === 0) {
        throw new Error(`Invalid step at index ${index}: options must be a non-empty array`);
      }

      let hasCorrectOption = false;
      step.options.forEach((option, optIndex) => {
        if (!option.id || typeof option.id !== 'string') {
          throw new Error(`Invalid option at step ${index}, option ${optIndex}: missing or invalid id`);
        }

        if (!option.label || typeof option.label !== 'string') {
          throw new Error(`Invalid option at step ${index}, option ${optIndex}: missing or invalid label`);
        }

        if (typeof option.correct !== 'boolean') {
          throw new Error(`Invalid option at step ${index}, option ${optIndex}: correct must be a boolean`);
        }

        if (option.correct) {
          hasCorrectOption = true;
        }
      });

      if (!hasCorrectOption) {
        throw new Error(`Invalid step at index ${index}: must have at least one correct option`);
      }
    });

    return true;
  }

  /**
   * Generate a flowchart from a problem description
   * Base implementation - apps should override with their specific logic
   */
  async generateFlowchart(problem, options = {}) {
    if (!problem || typeof problem !== 'string' || problem.trim().length === 0) {
      throw new ApiError('Problem text is required and cannot be empty', 400);
    }

    try {
      const response = await this._fetchWithTimeout(`${this.baseURL}/api/flowchart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem: problem.trim(),
          ...options,
        }),
      });

      const data = await this._handleResponse(response);

      // Validate flowchart structure
      this._validateFlowchart(data);

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(
          'Unable to connect to the server. Please check your internet connection.',
          0
        );
      }

      throw new ApiError(
        error.message || 'An unexpected error occurred while generating the flowchart',
        500
      );
    }
  }

  /**
   * Get learning resources for a specific step
   */
  async getStepLinks(problem, stepTitle, stepDescription) {
    try {
      const response = await this._fetchWithTimeout(`${this.baseURL}/api/step-links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem,
          step_title: stepTitle,
          step_description: stepDescription,
        }),
      });

      return await this._handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        'Unable to fetch learning resources',
        500
      );
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck() {
    try {
      const response = await this._fetchWithTimeout(`${this.baseURL}/`);
      return await this._handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError('Unable to reach the server', 0);
    }
  }
}

export default BaseApiService;