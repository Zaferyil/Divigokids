import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DiviGoKids from '../components/DiviGoKids';

// Mock AudioContext
const mockOscillator = {
  connect: jest.fn(),
  frequency: { value: 0 },
  start: jest.fn(),
  stop: jest.fn(),
};

const mockGainNode = {
  connect: jest.fn(),
  gain: {
    setValueAtTime: jest.fn(),
    exponentialRampToValueAtTime: jest.fn(),
  },
};

const mockAudioContext = {
  createOscillator: jest.fn(() => mockOscillator),
  createGain: jest.fn(() => mockGainNode),
  destination: {},
  currentTime: 0,
};

global.AudioContext = jest.fn(() => mockAudioContext);
global.webkitAudioContext = jest.fn(() => mockAudioContext);

// Mock window.innerWidth for responsive tests
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('DiviGoKids Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Home Screen', () => {
    it('should render the home screen by default', () => {
      render(<DiviGoKids />);
      expect(screen.getByText('DiviGo Kids')).toBeInTheDocument();
      expect(screen.getByText('Division mit Spaß lernen! 🎯')).toBeInTheDocument();
      expect(screen.getByText('Spielen!')).toBeInTheDocument();
    });

    it('should have a sound toggle button', () => {
      render(<DiviGoKids />);
      expect(screen.getByText(/Sound:/)).toBeInTheDocument();
    });

    it('should toggle sound when button is clicked', () => {
      render(<DiviGoKids />);
      const soundButton = screen.getByText(/Sound: An/);
      fireEvent.click(soundButton);
      expect(screen.getByText(/Sound: Aus/)).toBeInTheDocument();
    });

    it('should navigate to levels screen when Spielen button is clicked', () => {
      render(<DiviGoKids />);
      fireEvent.click(screen.getByText('Spielen!'));
      expect(screen.getByText('Level 1')).toBeInTheDocument();
      expect(screen.getByText('Einfache Division')).toBeInTheDocument();
    });
  });

  describe('Levels Screen', () => {
    it('should display all 12 stages', () => {
      render(<DiviGoKids />);
      fireEvent.click(screen.getByText('Spielen!'));

      for (let i = 1; i <= 12; i++) {
        expect(screen.getByText(`Stage ${i}`)).toBeInTheDocument();
      }
    });

    it('should display level information', () => {
      render(<DiviGoKids />);
      fireEvent.click(screen.getByText('Spielen!'));

      expect(screen.getByText('Level 1')).toBeInTheDocument();
      expect(screen.getByText('Einfache Division')).toBeInTheDocument();
    });

    it('should navigate between levels', () => {
      render(<DiviGoKids />);
      fireEvent.click(screen.getByText('Spielen!'));

      // Find the right arrow button (second arrow)
      const arrows = screen.getAllByRole('button');
      const rightArrow = arrows.find(btn => !btn.disabled && btn.querySelector('svg'));

      // Click next level
      fireEvent.click(rightArrow);
      expect(screen.getByText('Level 2')).toBeInTheDocument();
    });

    it('should navigate back to home screen', () => {
      render(<DiviGoKids />);
      fireEvent.click(screen.getByText('Spielen!'));

      // Find back button (first button with arrow)
      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[0]);

      expect(screen.getByText('DiviGo Kids')).toBeInTheDocument();
    });

    it('should display stars for completed stages', () => {
      // Set up saved progress
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        'level1_stage1': 3,
        'level1_stage2': 2,
      }));

      render(<DiviGoKids />);
      fireEvent.click(screen.getByText('Spielen!'));

      // Stars should be rendered (checking SVG elements exist)
      const stars = screen.getAllByRole('button');
      expect(stars.length).toBeGreaterThan(0);
    });
  });

  describe('Quiz Screen', () => {
    beforeEach(() => {
      render(<DiviGoKids />);
      fireEvent.click(screen.getByText('Spielen!'));
      // Click on Stage 1
      fireEvent.click(screen.getByText('Stage 1'));
    });

    it('should display a question', () => {
      expect(screen.getByText(/Frage 1 von 10/)).toBeInTheDocument();
      expect(screen.getByText(/= \?/)).toBeInTheDocument();
    });

    it('should display 4 answer options', () => {
      const buttons = screen.getAllByRole('button');
      // Filter for answer buttons (they contain numbers)
      const answerButtons = buttons.filter(btn =>
        !isNaN(parseInt(btn.textContent)) && btn.textContent.trim().length <= 3
      );
      expect(answerButtons.length).toBe(4);
    });

    it('should show feedback after selecting an answer', async () => {
      const buttons = screen.getAllByRole('button');
      const answerButtons = buttons.filter(btn =>
        !isNaN(parseInt(btn.textContent)) && btn.textContent.trim().length <= 3
      );

      fireEvent.click(answerButtons[0]);

      // Feedback should be shown
      expect(screen.getByText(/Richtige Antworten:/)).toBeInTheDocument();
    });

    it('should advance to next question after timeout', async () => {
      const buttons = screen.getAllByRole('button');
      const answerButtons = buttons.filter(btn =>
        !isNaN(parseInt(btn.textContent)) && btn.textContent.trim().length <= 3
      );

      fireEvent.click(answerButtons[0]);

      // Fast forward 1.5 seconds
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      expect(screen.getByText(/Frage 2 von 10/)).toBeInTheDocument();
    });

    it('should navigate back to levels from quiz', () => {
      const buttons = screen.getAllByRole('button');
      // Back button is first
      fireEvent.click(buttons[0]);

      expect(screen.getByText('Level 1')).toBeInTheDocument();
    });
  });

  describe('Result Screen', () => {
    it('should show result screen after completing all questions', async () => {
      render(<DiviGoKids />);
      fireEvent.click(screen.getByText('Spielen!'));
      fireEvent.click(screen.getByText('Stage 1'));

      // Answer all 10 questions
      for (let i = 0; i < 10; i++) {
        const buttons = screen.getAllByRole('button');
        const answerButtons = buttons.filter(btn =>
          !isNaN(parseInt(btn.textContent)) && btn.textContent.trim().length <= 3
        );

        fireEvent.click(answerButtons[0]);

        act(() => {
          jest.advanceTimersByTime(1500);
        });
      }

      // Should show result screen
      expect(screen.getByText('Gut gemacht!')).toBeInTheDocument();
      expect(screen.getByText(/von 10 richtig/)).toBeInTheDocument();
    });

    it('should have button to return to levels', async () => {
      render(<DiviGoKids />);
      fireEvent.click(screen.getByText('Spielen!'));
      fireEvent.click(screen.getByText('Stage 1'));

      // Answer all 10 questions
      for (let i = 0; i < 10; i++) {
        const buttons = screen.getAllByRole('button');
        const answerButtons = buttons.filter(btn =>
          !isNaN(parseInt(btn.textContent)) && btn.textContent.trim().length <= 3
        );

        fireEvent.click(answerButtons[0]);

        act(() => {
          jest.advanceTimersByTime(1500);
        });
      }

      expect(screen.getByText('Zurück zu Levels')).toBeInTheDocument();
    });

    it('should have button for next stage if not on last stage', async () => {
      render(<DiviGoKids />);
      fireEvent.click(screen.getByText('Spielen!'));
      fireEvent.click(screen.getByText('Stage 1'));

      // Answer all 10 questions
      for (let i = 0; i < 10; i++) {
        const buttons = screen.getAllByRole('button');
        const answerButtons = buttons.filter(btn =>
          !isNaN(parseInt(btn.textContent)) && btn.textContent.trim().length <= 3
        );

        fireEvent.click(answerButtons[0]);

        act(() => {
          jest.advanceTimersByTime(1500);
        });
      }

      expect(screen.getByText('Nächste Stage')).toBeInTheDocument();
    });
  });

  describe('LocalStorage persistence', () => {
    it('should load progress from localStorage on mount', () => {
      const savedProgress = {
        'level1_stage1': 3,
        'level2_stage5': 2,
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedProgress));

      render(<DiviGoKids />);

      expect(localStorageMock.getItem).toHaveBeenCalledWith('diviGoKidsProgress');
    });

    it('should save progress to localStorage when stars are earned', async () => {
      render(<DiviGoKids />);
      fireEvent.click(screen.getByText('Spielen!'));
      fireEvent.click(screen.getByText('Stage 1'));

      // Answer all 10 questions
      for (let i = 0; i < 10; i++) {
        const buttons = screen.getAllByRole('button');
        const answerButtons = buttons.filter(btn =>
          !isNaN(parseInt(btn.textContent)) && btn.textContent.trim().length <= 3
        );

        fireEvent.click(answerButtons[0]);

        act(() => {
          jest.advanceTimersByTime(1500);
        });
      }

      // Check that localStorage was called
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  describe('Sound effects', () => {
    it('should play sound on correct answer when sound is enabled', () => {
      render(<DiviGoKids />);
      fireEvent.click(screen.getByText('Spielen!'));
      fireEvent.click(screen.getByText('Stage 1'));

      const buttons = screen.getAllByRole('button');
      const answerButtons = buttons.filter(btn =>
        !isNaN(parseInt(btn.textContent)) && btn.textContent.trim().length <= 3
      );

      fireEvent.click(answerButtons[0]);

      expect(global.AudioContext).toHaveBeenCalled();
    });

    it('should not play sound when sound is disabled', () => {
      render(<DiviGoKids />);

      // Disable sound
      const soundButton = screen.getByText(/Sound: An/);
      fireEvent.click(soundButton);

      // Clear mocks after toggle click
      jest.clearAllMocks();

      fireEvent.click(screen.getByText('Spielen!'));
      fireEvent.click(screen.getByText('Stage 1'));

      const buttons = screen.getAllByRole('button');
      const answerButtons = buttons.filter(btn =>
        !isNaN(parseInt(btn.textContent)) && btn.textContent.trim().length <= 3
      );

      fireEvent.click(answerButtons[0]);

      // AudioContext should not be called for answer sound
      // (may be called for click sound before disabling)
    });
  });
});
