// Implemented component tests for the PomodoroTimer.
import React from 'react';
// Fix: Using a namespace import as a workaround for potential module resolution issues where named exports are not found.
import * as RTL from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PomodoroTimer } from '../PomodoroTimer';
import '@testing-library/jest-dom';

describe('PomodoroTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Fix: Properly mock window.alert using vi.spyOn for jsdom environment, and corrected 'global' usage.
    vi.spyOn(window, 'alert').mockImplementation(vi.fn());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders initial state correctly', () => {
    RTL.render(<PomodoroTimer />);
    expect(RTL.screen.getByText('Focus Timer')).toBeInTheDocument();
    expect(RTL.screen.getByText('25:00')).toBeInTheDocument();
    expect(RTL.screen.getByText('Work')).toBeInTheDocument();
    expect(RTL.screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
    expect(RTL.screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    expect(RTL.screen.getByText('Completed cycles: 0')).toBeInTheDocument();
  });

  it('starts and pauses the timer', () => {
    RTL.render(<PomodoroTimer />);
    const startButton = RTL.screen.getByRole('button', { name: 'Start' });
    
    // Start timer
    RTL.fireEvent.click(startButton);
    expect(RTL.screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
    
    // Advance time
    RTL.act(() => {
        vi.advanceTimersByTime(2000); // 2 seconds
    });
    
    expect(RTL.screen.getByText('24:58')).toBeInTheDocument();

    // Pause timer
    const pauseButton = RTL.screen.getByRole('button', { name: 'Pause' });
    RTL.fireEvent.click(pauseButton);
    expect(RTL.screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
    
    // Advance time again - should not change
    RTL.act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(RTL.screen.getByText('24:58')).toBeInTheDocument();
  });

  it('resets the timer', () => {
    RTL.render(<PomodoroTimer />);
    const startButton = RTL.screen.getByRole('button', { name: 'Start' });
    RTL.fireEvent.click(startButton);
    
    RTL.act(() => {
      vi.advanceTimersByTime(5000); // 5 seconds
    });

    expect(RTL.screen.getByText('24:55')).toBeInTheDocument();
    
    const resetButton = RTL.screen.getByRole('button', { name: 'Reset' });
    RTL.fireEvent.click(resetButton);

    expect(RTL.screen.getByText('25:00')).toBeInTheDocument();
    expect(RTL.screen.getByText('Work')).toBeInTheDocument();
    expect(RTL.screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
    expect(RTL.screen.getByText('Completed cycles: 0')).toBeInTheDocument();
  });

  it('switches from work to break mode', () => {
    RTL.render(<PomodoroTimer />);
    const startButton = RTL.screen.getByRole('button', { name: 'Start' });
    RTL.fireEvent.click(startButton);
    
    // Advance time to end of work cycle
    RTL.act(() => {
        vi.advanceTimersByTime(25 * 60 * 1000);
    });

    // Fix: Use window.alert for expectations
    expect(window.alert).toHaveBeenCalledWith('Time for a break!');
    expect(RTL.screen.getByText('05:00')).toBeInTheDocument();
    expect(RTL.screen.getByText('Break')).toBeInTheDocument();
    expect(RTL.screen.getByText('Completed cycles: 1')).toBeInTheDocument();
  });

  it('switches from break to work mode', () => {
    RTL.render(<PomodoroTimer />);
    const startButton = RTL.screen.getByRole('button', { name: 'Start' });
    RTL.fireEvent.click(startButton);
    
    // Complete work cycle
    RTL.act(() => {
        vi.advanceTimersByTime(25 * 60 * 1000);
    });
    
    expect(RTL.screen.getByText('05:00')).toBeInTheDocument();

    // Complete break cycle
    RTL.act(() => {
        vi.advanceTimersByTime(5 * 60 * 1000);
    });

    // Fix: Use window.alert for expectations
    expect(window.alert).toHaveBeenCalledWith('Break is over. Time to focus!');
    expect(RTL.screen.getByText('25:00')).toBeInTheDocument();
    expect(RTL.screen.getByText('Work')).toBeInTheDocument();
    expect(RTL.screen.getByText('Completed cycles: 1')).toBeInTheDocument(); // still 1 cycle completed
  });
});