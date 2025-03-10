// utils.js

// debounceWithTimeout: Debouncing with setTimeout
export function debounceWithTimeout(fn, delay) {
  let timeout;
  return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

// debounceWithRAF: Debouncing with requestAnimationFrame
export function debounceWithRAF(fn) {
  let frame;
  return function (...args) {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => fn.apply(this, args));
  };
}

// debounceWithTimestamp: Debouncing with timestamp
export function debounceWithTimestamp(fn, delay) {
  let lastCall = 0;
  return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
          lastCall = now;
          fn.apply(this, args);
      }
  };
}

// throttleWithTimeout: Throttling with setTimeout
export function throttleWithTimeout(fn, delay) {
  let lastCall = 0;
  return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
          lastCall = now;
          fn.apply(this, args);
      }
  };
}

// throttleWithRAF: Throttling with requestAnimationFrame
export function throttleWithRAF(fn) {
  let frame;
  return function (...args) {
      if (!frame) {
          frame = requestAnimationFrame(() => {
              fn.apply(this, args);
              frame = null;
          });
      }
  };
}

