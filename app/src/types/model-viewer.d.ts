import React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          poster?: string;
          alt?: string;
          'auto-rotate'?: boolean;
          'auto-rotate-delay'?: string;
          'rotation-per-second'?: string;
          'camera-controls'?: boolean;
          'disable-zoom'?: boolean;
          'interaction-prompt'?: string;
          'shadow-intensity'?: string;
          exposure?: string;
          class?: string;
        },
        HTMLElement
      >;
    }
  }
}
