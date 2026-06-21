import { DiceRoller } from '../models/DiceRoller';

describe('DiceRoller', () => {
  it('rolls d20 within 1-20 range', () => {
    for (let i = 0; i < 1000; i++) {
      const result = DiceRoller.rollSingle('d20');
      expect(result.total).toBeGreaterThanOrEqual(1);
      expect(result.total).toBeLessThanOrEqual(20);
    }
  });

  it('rolls custom dice within range', () => {
    for (let i = 0; i < 100; i++) {
      const result = DiceRoller.rollSingle({ type: 'custom', sides: 5 });
      expect(result.total).toBeGreaterThanOrEqual(1);
      expect(result.total).toBeLessThanOrEqual(5);
    }
  });

  it('handles percentile d100 correctly (1-100 range)', () => {
    let rolled100 = false;
    for (let i = 0; i < 5000; i++) {
      const result = DiceRoller.rollSingle('d100');
      expect(result.isPercentile).toBe(true);
      expect(result.total).toBeGreaterThanOrEqual(1);
      expect(result.total).toBeLessThanOrEqual(100);
      
      // Check components
      const [tens, units] = result.components!;
      expect(tens).toBeGreaterThanOrEqual(0);
      expect(tens).toBeLessThanOrEqual(9);
      expect(units).toBeGreaterThanOrEqual(0);
      expect(units).toBeLessThanOrEqual(9);
      
      if (result.total === 100) {
        expect(tens).toBe(0);
        expect(units).toBe(0);
        rolled100 = true;
      } else {
        expect(result.total).toBe(tens * 10 + units);
      }
    }
    expect(rolled100).toBe(true); // Statistically should happen in 5000 rolls
  });

  it('rolls multiple dice and clamps to max 20', () => {
    const result = DiceRoller.rollMultiple('d6', 50);
    expect(result.values.length).toBe(20); // Clamped to 20
    
    result.values.forEach(val => {
      expect(val).toBeGreaterThanOrEqual(1);
      expect(val).toBeLessThanOrEqual(6);
    });
  });
});
