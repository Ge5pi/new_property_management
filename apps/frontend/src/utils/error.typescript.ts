export interface INormalizedError {
  /**
   * Original error.
   */
  err: unknown;

  /**
   * Is error instance?
   */
  isError: boolean;

  /**
   * Error object.
   */
  error?: Error;

  /**
   * Call stack.
   */
  stack?: Error['stack'];

  /**
   * Error message.
   */
  message: string;

  toString(): string;
}

/**
 * Normalize error.
 *
 * @param err Error instance.
 * @returns Normalized error object.
 */
export const normalizeError = (err: Error | string | object | unknown): Readonly<INormalizedError> => {
  const result: INormalizedError = {
    err,
    message: '',
    isError: false,
    toString() {
      return this.message;
    },
  };

  if (err instanceof Error) {
    result.error = err;
    result.message = err.message;
    result.stack = err.stack;
    result.isError = true;
    result.toString = () => err.toString();
  } else if (typeof err === 'string') {
    result.error = new Error(err);
    result.message = err;
    result.stack = result.error.stack;
  } else {
    if (typeof err === 'object' && err) {
      result.message = 'message' in err ? (err.message as string) : String(err);
      result.toString = () => {
        const m = typeof err.toString === 'function' ? err.toString() : result.message;
        return m === '[object Object]' ? result.message : m;
      };
    } else if (typeof err === 'function') {
      return normalizeError(err());
    } else {
      result.message = String(`[${typeof err}] ${err}`);
    }

    result.error = new Error(result.message);
    if (err !== null && (err instanceof Error || typeof err === 'object')) {
      result.stack = 'stack' in err ? (err.stack as string) : result.error.stack;
    }
  }

  return result;
};
