declare module 'shogi.js';
declare module 'encoding-japanese';
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'shogi-player-wc': any;
    }
  }
  namespace React.JSX {
    interface IntrinsicElements {
      'shogi-player-wc': any;
    }
  }
}