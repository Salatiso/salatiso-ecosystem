import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '@/pages/index';

// Mock I18n context to prevent provider errors
jest.mock('@/contexts/I18nContext', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: jest.fn() }
  }),
  I18nProvider: ({ children }: any) => <div>{children}</div>
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...rest }: any) => {
      const {
        initial,
        animate,
        transition,
        whileInView,
        viewport,
        variants,
        ...domProps
      } = rest;

      return <div {...domProps}>{children}</div>;
    },
    section: ({ children, ...rest }: any) => <section {...rest}>{children}</section>,
    h1: ({ children, ...rest }: any) => <h1 {...rest}>{children}</h1>,
    p: ({ children, ...rest }: any) => <p {...rest}>{children}</p>,
  },
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
    push: jest.fn(),
    prefetch: jest.fn(),
    replace: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    basePath: '',
    query: {},
    asPath: '/',
  }),
}));

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(<HomePage />);
    // Basic smoke test - just verify component renders
    expect(document.body).toBeTruthy();
  });
});
