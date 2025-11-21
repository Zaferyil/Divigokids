import '@testing-library/jest-dom';

// Suppress console warnings during tests
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.('React does not recognize')) return;
  originalWarn(...args);
};
