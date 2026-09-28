/**
 * Formats API errors into professional, user-friendly messages.
 * Maps HTTP status codes and network errors to clean messages.
 */
export const getErrorMessage = (error, fallbackMessage = 'An unexpected error occurred. Please try again.') => {
  // If backend returned a specific message, use it
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Map HTTP status codes to professional messages
  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 400:
        return 'Invalid request. Please verify the submitted data and try again.';
      case 401:
        return 'Authentication failed. Invalid credentials provided.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'A conflict occurred. This record may already exist.';
      case 422:
        return 'The submitted data could not be processed. Please check your inputs.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Internal server error. Our team has been notified. Please try again later.';
      case 502:
        return 'Service temporarily unavailable. Please try again in a few moments.';
      case 503:
        return 'The server is currently under maintenance. Please try again later.';
      default:
        return `An error occurred (Code: ${status}). Please try again.`;
    }
  }

  // Network / connection errors
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return 'Unable to connect to the server. Please check your network connection and try again.';
  }

  if (error.code === 'ECONNABORTED') {
    return 'The request timed out. Please check your connection and try again.';
  }

  return fallbackMessage;
};
