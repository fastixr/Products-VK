import 'whatwg-fetch';
import '@testing-library/jest-dom';
import 'cross-fetch/polyfill';

if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

if (typeof global.BroadcastChannel === 'undefined') {
  // @ts-ignore
  global.BroadcastChannel = class {
    constructor() {}
    postMessage() {}
    close() {}
    addEventListener() {}
    removeEventListener() {}
    onmessage = null;
  };
}

if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  class IntersectionObserver {
    constructor() {}
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
    takeRecords() { return []; }
  }
  // @ts-ignore
  window.IntersectionObserver = IntersectionObserver;
  // @ts-ignore
  window.IntersectionObserverEntry = function() {};
} 