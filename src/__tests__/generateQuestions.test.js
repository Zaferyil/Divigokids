import { generateQuestions } from '../components/DiviGoKids';

describe('generateQuestions', () => {
  describe('general properties', () => {
    it('should generate exactly 10 questions', () => {
      for (let level = 1; level <= 4; level++) {
        for (let stage = 1; stage <= 12; stage++) {
          const questions = generateQuestions(stage, level);
          expect(questions).toHaveLength(10);
        }
      }
    });

    it('should always have 4 answer options per question', () => {
      for (let level = 1; level <= 4; level++) {
        const questions = generateQuestions(1, level);
        questions.forEach((q) => {
          expect(q.answers).toHaveLength(4);
        });
      }
    });

    it('should include the correct answer in the options', () => {
      for (let level = 1; level <= 4; level++) {
        const questions = generateQuestions(1, level);
        questions.forEach((q) => {
          expect(q.answers).toContain(q.correctAnswer);
        });
      }
    });

    it('should have unique answer options (no duplicates)', () => {
      for (let level = 1; level <= 4; level++) {
        const questions = generateQuestions(1, level);
        questions.forEach((q) => {
          const uniqueAnswers = new Set(q.answers);
          expect(uniqueAnswers.size).toBe(4);
        });
      }
    });

    it('should always produce whole number division results', () => {
      for (let level = 1; level <= 4; level++) {
        for (let stage = 1; stage <= 12; stage++) {
          const questions = generateQuestions(stage, level);
          questions.forEach((q) => {
            expect(q.dividend % q.divisor).toBe(0);
            expect(q.dividend / q.divisor).toBe(q.correctAnswer);
          });
        }
      }
    });

    it('should only have positive wrong answers', () => {
      for (let level = 1; level <= 4; level++) {
        const questions = generateQuestions(1, level);
        questions.forEach((q) => {
          q.answers.forEach((answer) => {
            expect(answer).toBeGreaterThan(0);
          });
        });
      }
    });
  });

  describe('Level 1 - Simple division', () => {
    it('should use divisor based on stage (2-7 for stages 1-6)', () => {
      for (let stage = 1; stage <= 6; stage++) {
        const questions = generateQuestions(stage, 1);
        const expectedDivisor = stage + 1;
        questions.forEach((q) => {
          expect(q.divisor).toBe(expectedDivisor);
        });
      }
    });

    it('should use divisor based on stage (6-11 for stages 7-12)', () => {
      for (let stage = 7; stage <= 12; stage++) {
        const questions = generateQuestions(stage, 1);
        const expectedDivisor = stage - 1;
        questions.forEach((q) => {
          expect(q.divisor).toBe(expectedDivisor);
        });
      }
    });

    it('should have correct answers in range 1-10', () => {
      const questions = generateQuestions(1, 1);
      questions.forEach((q) => {
        expect(q.correctAnswer).toBeGreaterThanOrEqual(1);
        expect(q.correctAnswer).toBeLessThanOrEqual(10);
      });
    });
  });

  describe('Level 2 - Two-digit division', () => {
    it('should use divisors 2-5 for stages 1-6', () => {
      for (let stage = 1; stage <= 6; stage++) {
        const questions = generateQuestions(stage, 2);
        questions.forEach((q) => {
          expect(q.divisor).toBeGreaterThanOrEqual(2);
          expect(q.divisor).toBeLessThanOrEqual(5);
        });
      }
    });

    it('should use divisors 6-9 for stages 7-12', () => {
      for (let stage = 7; stage <= 12; stage++) {
        const questions = generateQuestions(stage, 2);
        questions.forEach((q) => {
          expect(q.divisor).toBeGreaterThanOrEqual(6);
          expect(q.divisor).toBeLessThanOrEqual(9);
        });
      }
    });

    it('should have correct answers in range 5-19 for stages 1-6', () => {
      const questions = generateQuestions(1, 2);
      questions.forEach((q) => {
        expect(q.correctAnswer).toBeGreaterThanOrEqual(5);
        expect(q.correctAnswer).toBeLessThanOrEqual(19);
      });
    });

    it('should have correct answers in range 10-19 for stages 7-12', () => {
      const questions = generateQuestions(7, 2);
      questions.forEach((q) => {
        expect(q.correctAnswer).toBeGreaterThanOrEqual(10);
        expect(q.correctAnswer).toBeLessThanOrEqual(19);
      });
    });
  });

  describe('Level 3 - Three-digit division', () => {
    it('should use divisors 2-5 for stages 1-6', () => {
      for (let stage = 1; stage <= 6; stage++) {
        const questions = generateQuestions(stage, 3);
        questions.forEach((q) => {
          expect(q.divisor).toBeGreaterThanOrEqual(2);
          expect(q.divisor).toBeLessThanOrEqual(5);
        });
      }
    });

    it('should use divisors 6-9 for stages 7-12', () => {
      for (let stage = 7; stage <= 12; stage++) {
        const questions = generateQuestions(stage, 3);
        questions.forEach((q) => {
          expect(q.divisor).toBeGreaterThanOrEqual(6);
          expect(q.divisor).toBeLessThanOrEqual(9);
        });
      }
    });

    it('should have correct answers in range 20-69 for stages 1-6', () => {
      const questions = generateQuestions(1, 3);
      questions.forEach((q) => {
        expect(q.correctAnswer).toBeGreaterThanOrEqual(20);
        expect(q.correctAnswer).toBeLessThanOrEqual(69);
      });
    });

    it('should have correct answers in range 50-99 for stages 7-12', () => {
      const questions = generateQuestions(7, 3);
      questions.forEach((q) => {
        expect(q.correctAnswer).toBeGreaterThanOrEqual(50);
        expect(q.correctAnswer).toBeLessThanOrEqual(99);
      });
    });
  });

  describe('Level 4 - Advanced division', () => {
    it('should use divisors 11-18 for stages 1-6', () => {
      for (let stage = 1; stage <= 6; stage++) {
        const questions = generateQuestions(stage, 4);
        questions.forEach((q) => {
          expect(q.divisor).toBeGreaterThanOrEqual(11);
          expect(q.divisor).toBeLessThanOrEqual(18);
        });
      }
    });

    it('should use divisors 11-20 for stages 7-12', () => {
      for (let stage = 7; stage <= 12; stage++) {
        const questions = generateQuestions(stage, 4);
        questions.forEach((q) => {
          expect(q.divisor).toBeGreaterThanOrEqual(11);
          expect(q.divisor).toBeLessThanOrEqual(20);
        });
      }
    });

    it('should have correct answers in range 10-29 for stages 1-6', () => {
      const questions = generateQuestions(1, 4);
      questions.forEach((q) => {
        expect(q.correctAnswer).toBeGreaterThanOrEqual(10);
        expect(q.correctAnswer).toBeLessThanOrEqual(29);
      });
    });

    it('should have correct answers in range 20-49 for stages 7-12', () => {
      const questions = generateQuestions(7, 4);
      questions.forEach((q) => {
        expect(q.correctAnswer).toBeGreaterThanOrEqual(20);
        expect(q.correctAnswer).toBeLessThanOrEqual(49);
      });
    });
  });

  describe('edge cases', () => {
    it('should return empty array for invalid level', () => {
      const questions = generateQuestions(1, 5);
      expect(questions).toEqual([]);
    });

    it('should return empty array for level 0', () => {
      const questions = generateQuestions(1, 0);
      expect(questions).toEqual([]);
    });
  });
});
