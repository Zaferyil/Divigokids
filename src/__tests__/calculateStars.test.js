import { calculateStars } from '../components/DiviGoKids';

describe('calculateStars', () => {
  describe('3 stars threshold (9-10 correct)', () => {
    it('should return 3 stars for score of 10', () => {
      expect(calculateStars(10)).toBe(3);
    });

    it('should return 3 stars for score of 9', () => {
      expect(calculateStars(9)).toBe(3);
    });
  });

  describe('2 stars threshold (7-8 correct)', () => {
    it('should return 2 stars for score of 8', () => {
      expect(calculateStars(8)).toBe(2);
    });

    it('should return 2 stars for score of 7', () => {
      expect(calculateStars(7)).toBe(2);
    });
  });

  describe('1 star threshold (5-6 correct)', () => {
    it('should return 1 star for score of 6', () => {
      expect(calculateStars(6)).toBe(1);
    });

    it('should return 1 star for score of 5', () => {
      expect(calculateStars(5)).toBe(1);
    });
  });

  describe('0 stars threshold (0-4 correct)', () => {
    it('should return 0 stars for score of 4', () => {
      expect(calculateStars(4)).toBe(0);
    });

    it('should return 0 stars for score of 3', () => {
      expect(calculateStars(3)).toBe(0);
    });

    it('should return 0 stars for score of 2', () => {
      expect(calculateStars(2)).toBe(0);
    });

    it('should return 0 stars for score of 1', () => {
      expect(calculateStars(1)).toBe(0);
    });

    it('should return 0 stars for score of 0', () => {
      expect(calculateStars(0)).toBe(0);
    });
  });

  describe('boundary values', () => {
    it('should correctly handle all boundary transitions', () => {
      // 0-4 -> 0 stars
      expect(calculateStars(4)).toBe(0);
      // 5-6 -> 1 star (boundary at 5)
      expect(calculateStars(5)).toBe(1);
      // 7-8 -> 2 stars (boundary at 7)
      expect(calculateStars(7)).toBe(2);
      // 9-10 -> 3 stars (boundary at 9)
      expect(calculateStars(9)).toBe(3);
    });
  });
});
