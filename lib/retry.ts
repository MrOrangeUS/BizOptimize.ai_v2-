export interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: any) => boolean;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    shouldRetry = (error) => {
      // Retry on network errors, 5xx server errors, and rate limits
      return (
        error.name === 'TypeError' || // Network error
        (error.status >= 500 && error.status < 600) || // Server error
        error.status === 429 // Rate limit
      );
    }
  } = options;

  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }
      
      const delay = delayMs * Math.pow(backoffMultiplier, attempt);
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} in ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

// Specific retry functions for common use cases
export async function retryFetch(
  url: string,
  options: RequestInit = {},
  retryOptions?: RetryOptions
): Promise<Response> {
  return withRetry(
    () => fetch(url, options),
    retryOptions
  );
}

export async function retryOpenAI(
  fn: () => Promise<any>,
  retryOptions?: RetryOptions
): Promise<any> {
  return withRetry(fn, {
    maxRetries: 3,
    delayMs: 2000,
    shouldRetry: (error) => {
      return (
        error.status === 429 || // Rate limit
        error.status >= 500 || // Server error
        error.message?.includes('timeout')
      );
    },
    ...retryOptions
  });
}

export async function retryDId(
  fn: () => Promise<any>,
  retryOptions?: RetryOptions
): Promise<any> {
  return withRetry(fn, {
    maxRetries: 2,
    delayMs: 3000,
    shouldRetry: (error) => {
      return (
        error.status === 429 || // Rate limit
        error.status >= 500 || // Server error
        error.message?.includes('timeout')
      );
    },
    ...retryOptions
  });
} 