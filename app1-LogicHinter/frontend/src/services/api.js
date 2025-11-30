/**
 * API Service for LogicHinter Frontend
 * Handles communication with the backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const REQUEST_TIMEOUT = 30000; // 30 seconds

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * API Service class for backend communication
 */
class ApiService {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Make a fetch request with timeout
   * @private
   */
  async _fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

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
          408,
          null
        );
      }
      throw error;
    }
  }

  /**
   * Validate flowchart structure
   * @private
   */
  _validateFlowchart(flowchart) {
    if (!flowchart || typeof flowchart !== 'object') {
      throw new Error('Invalid flowchart: must be an object');
    }

    if (!Array.isArray(flowchart.steps)) {
      throw new Error('Invalid flowchart: steps must be an array');
    }

    // Validate each step
    flowchart.steps.forEach((step, index) => {
      if (!step.id || typeof step.id !== 'string') {
        throw new Error(`Invalid step at index ${index}: missing or invalid id`);
      }

      if (!step.title || typeof step.title !== 'string') {
        throw new Error(`Invalid step at index ${index}: missing or invalid title`);
      }

      if (!step.description || typeof step.description !== 'string') {
        throw new Error(`Invalid step at index ${index}: missing or invalid description`);
      }

      if (!Array.isArray(step.options) || step.options.length === 0) {
        throw new Error(`Invalid step at index ${index}: options must be a non-empty array`);
      }

      // Validate each option
      let hasCorrectOption = false;
      step.options.forEach((option, optIndex) => {
        if (!option.id || typeof option.id !== 'string') {
          throw new Error(`Invalid option at step ${index}, option ${optIndex}: missing or invalid id`);
        }

        if (!option.label || typeof option.label !== 'string') {
          throw new Error(`Invalid option at step ${index}, option ${optIndex}: missing or invalid label`);
        }

        if (!option.reason || typeof option.reason !== 'string') {
          throw new Error(`Invalid option at step ${index}, option ${optIndex}: missing or invalid reason`);
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
   * @param {string} problem - The coding problem text
   * @param {string} approach - The approach type: 'naive', 'optimized', or 'both'
   * @returns {Promise<Object>} The flowchart data
   */
  async generateFlowchart(problem, approach = 'both') {
    if (!problem || typeof problem !== 'string' || problem.trim().length === 0) {
      throw new ApiError(
        'Problem text is required and cannot be empty',
        400,
        null
      );
    }

    try {
      const response = await this._fetchWithTimeout(`${this.baseURL}/api/flowchart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem: problem.trim(),
          approach: approach || 'both',
        }),
      });

      // Handle HTTP errors
      if (!response.ok) {
        let errorMessage = 'Failed to generate flowchart';
        let errorData = null;

        try {
          errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }

        throw new ApiError(errorMessage, response.status, errorData);
      }

      // Parse response
      const data = await response.json();

      // Check for warning from backend
      if (data.warning) {
        console.warn('Backend warning:', data.warning);
      }

      // Validate flowchart structure
      try {
        this._validateFlowchart(data);
      } catch (validationError) {
        throw new ApiError(
          `Invalid flowchart structure: ${validationError.message}`,
          500,
          data
        );
      }

      return data;
    } catch (error) {
      // Handle network errors
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(
          'Unable to connect to the server. Please check your internet connection and try again.',
          0,
          null
        );
      }

      // Generic error
      throw new ApiError(
        error.message || 'An unexpected error occurred while generating the flowchart',
        500,
        null
      );
    }
  }

  /**
   * Health check endpoint
   * @returns {Promise<Object>} Health status
   */
  async healthCheck() {
    try {
      const response = await this._fetchWithTimeout(`${this.baseURL}/api/health`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new ApiError('Health check failed', response.status, null);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        'Unable to reach the server',
        0,
        null
      );
    }
  }
}

// Export singleton instance
const apiService = new ApiService();

export default apiService;
export { ApiService, ApiError };
