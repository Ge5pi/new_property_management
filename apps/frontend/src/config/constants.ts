declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    env: any;
  }
}

function readEnv(name: string, defaultValue = undefined) {
  if (window.env && window.env[name]) {
    return window.env[name];
  } else if (process.env && process.env[name]) {
    return process.env[name];
  } else {
    return defaultValue;
  }
}

export const BACKEND_BASE_URL = 'http://localhost:8000';
