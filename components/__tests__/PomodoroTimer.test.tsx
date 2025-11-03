// Implemented component tests for the PomodoroTimer.
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PomodoroTimer } from '../PomodoroTimer';
import '@testing-library/jest-dom';

describe('PomodoroTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock alert
    global.alert = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders initial state correctly', () => {
    render(<PomodoroTimer />);
    expect(screen.getByText('Focus Timer')).toBeInTheDocument();
    expect(screen.getByText('25:00')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    expect(screen.getByText('Completed cycles: 0')).toBeInTheDocument();
  });

  it('starts and pauses the timer', () => {
    render(<PomodoroTimer />);
    const startButton = screen.getByRole('button', { name: 'Start' });
    
    // Start timer
    fireEvent.click(startButton);
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
    
    // Advance time
    act(() => {
        vi.advanceTimersByTime(2000); // 2 seconds
    });
    
    expect(screen.getByText('24:58')).toBeInTheDocument();

    // Pause timer
    const pauseButton = screen.getByRole('button', { name: 'Pause' });
    fireEvent.click(pauseButton);
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
    
    // Advance time again - should not change
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('24:58')).toBeInTheDocument();
  });

  it('resets the timer', () => {
    render(<PomodoroTimer />);
    const startButton = screen.getByRole('button', { name: 'Start' });
    fireEvent.click(startButton);
    
    act(() => {
      vi.advanceTimersByTime(5000); // 5 seconds
    });

    expect(screen.getByText('24:55')).toBeInTheDocument();
    
    const resetButton = screen.getByRole('button', { name: 'Reset' });
    fireEvent.click(resetButton);

    expect(screen.getByText('25:00')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
    expect(screen.getByText('Completed cycles: 0')).toBeInTheDocument();
  });

  it('switches from work to break mode', () => {
    render(<PomodoroTimer />);
    const startButton = screen.getByRole('button', { name: 'Start' });
    fireEvent.click(startButton);
    
    // Advance time to end of work cycle
    act(() => {
        vi.advanceTimersByTime(25 * 60 * 1000);
    });

    expect(global.alert).toHaveBeenCalledWith('Time for a break!');
    expect(screen.getByText('05:00')).toBeInTheDocument();
    expect(screen.getByText('Break')).toBeInTheDocument();
    expect(screen.getByText('Completed cycles: 1')).toBeInTheDocument();
  });

  it('switches from break to work mode', () => {
    render(<PomodoroTimer />);
    const startButton = screen.getByRole('button', { name: 'Start' });
    fireEvent.click(startButton);
    
    // Complete work cycle
    act(() => {
        vi.advanceTimersByTime(25 * 60 * 1000);
    });
    
    expect(screen.getByText('05:00')).toBeInTheDocument();

    // Complete break cycle
    act(() => {
        vi.advanceTimersByTime(5 * 60 * 1000);
    });

    expect(global.alert).toHaveBeenCalledWith('Break is over. Time to focus!');
    expect(screen.getByText('25:00')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Completed cycles: 1')).toBeInTheDocument(); // still 1 cycle completed
  });
});
