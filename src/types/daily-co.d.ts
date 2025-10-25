// Type declarations for @daily-co/daily-react
// This file provides type stubs for the @daily-co/daily-react package

declare module '@daily-co/daily-react' {
  import React from 'react';
  
  export interface DailyIframeProps {
    url?: string;
    token?: string;
    userName?: string;
    onLoaded?: () => void;
    onError?: (error: Error) => void;
    [key: string]: any;
  }
  
  const DailyIframe: React.FC<DailyIframeProps>;
  export default DailyIframe;
  
  export interface useDaily {
    (): any;
  }
  
  export const useDaily: useDaily;
  
  export interface DailyProvider {
    (props: any): React.ReactNode;
  }
  
  export const DailyProvider: DailyProvider;
}
