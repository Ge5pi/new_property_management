// This script generates runtime configuration for the React app
const fs = require('fs');
const path = require('path');

// Get environment variables
const config = {
  VERSION: process.env.REACT_APP_VERSION || '0.1.0',
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  STRIPE_KEY: process.env.REACT_APP_STRIPE_KEY || '',
};

// Create window.env configuration
const content = `window.env = ${JSON.stringify(config, null, 2)};`;

// Ensure build directory exists
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Write to stdout (will be redirected to config.js by the npm script)
console.log(content);
