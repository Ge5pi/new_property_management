export const HTTPResponse = [
  {
    code: 400,
    response: 'Bad Request',
    message: 'The server could not understand the request due to invalid request. Please verify your input',
  },
  {
    code: 401,
    response: 'Unauthorized',
    message: 'Authentication is required and has failed or has not yet been provided.',
  },
  {
    code: 403,
    response: 'Forbidden',
    message:
      "You don't have access rights to the content, i.e., you are unauthorized, so server is rejecting to give proper response.",
  },
  {
    code: 404,
    response: 'Not Found',
    message: "The server can't find the requested resource.",
  },
  {
    code: 408,
    response: 'Request Timeout',
    message:
      'The server timed out waiting for the request. This can happen if the server is overloaded or if the your internet connection is slow.',
  },
  {
    code: 429,
    response: 'Too Many Requests',
    message:
      'You have sent too many requests in a given amount of time. This error is usually temporary, please try again after few minutes.',
  },
  {
    code: 500,
    response: 'Internal Server Error',
    message: 'An unexpected condition was encountered by a server, please contact support',
  },
  {
    code: 502,
    response: 'Bad Gateway',
    message: 'The server received an invalid response from the backend, please contact support',
  },
  {
    code: 503,
    response: 'Service Unavailable',
    message:
      'The server is currently unavailable and cannot handle the request. Please try again after few minutes. If the problem persist please contact support.',
  },
];
