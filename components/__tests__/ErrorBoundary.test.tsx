/**
 * ErrorBoundary Tests
 */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Text } from 'react-native';
import { ErrorBoundary } from '../ErrorBoundary';

// Suppress console.error from ErrorBoundary's componentDidCatch and React's error logging
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

const ThrowError = ({ message }: { message: string }) => {
  throw new Error(message);
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    (console.error as jest.Mock).mockClear();
  });

  it('renders children normally when no error', () => {
    render(
      <ErrorBoundary>
        <Text>Hello</Text>
      </ErrorBoundary>
    );
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('shows error UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError message="Test crash" />
      </ErrorBoundary>
    );
    expect(screen.getByText('Ups! Etwas ist schiefgelaufen')).toBeTruthy();
    expect(screen.getByText(/Die App ist auf ein Problem gestoßen/)).toBeTruthy();
  });

  it('shows "Neu starten" button in error state', () => {
    render(
      <ErrorBoundary>
        <ThrowError message="Test crash" />
      </ErrorBoundary>
    );
    expect(screen.getByText('Neu starten')).toBeTruthy();
  });

  it('shows error details in DEV mode', () => {
    render(
      <ErrorBoundary>
        <ThrowError message="Detailed error" />
      </ErrorBoundary>
    );
    expect(screen.getByText(/Detailed error/)).toBeTruthy();
  });

  it('calls console.error via componentDidCatch', () => {
    render(
      <ErrorBoundary>
        <ThrowError message="Logged error" />
      </ErrorBoundary>
    );
    expect(console.error).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error)
    );
  });
});
