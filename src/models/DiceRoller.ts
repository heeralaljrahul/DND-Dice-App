import { DieType, RollResult, getSides } from './DieType';

export class DiceRoller {
  /**
   * Generates a random integer between min and max (inclusive)
   */
  public static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Rolls a single die and returns the result
   */
  public static rollSingle(dieType: DieType): RollResult {
    if (dieType === 'd100') {
      // Percentile logic: 00 to 90 for tens, 0 to 9 for units.
      // Math.random() gives 0..9 for each.
      const tensDigit = this.randomInt(0, 9);
      const unitsDigit = this.randomInt(0, 9);
      
      const tens = tensDigit * 10;
      const units = unitsDigit;
      
      let total = tens + units;
      
      // Special case: 00 + 0 = 100
      if (total === 0) {
        total = 100;
      }

      return {
        dieType,
        values: [total],
        total,
        isPercentile: true,
        components: [tensDigit, unitsDigit] // store the raw digits 0-9
      };
    }

    const sides = getSides(dieType);
    const result = this.randomInt(1, sides);

    return {
      dieType,
      values: [result],
      total: result,
      isPercentile: false
    };
  }

  /**
   * Rolls multiple dice of the same type and returns the combined result
   */
  public static rollMultiple(dieType: DieType, count: number): RollResult {
    // Clamp count
    const safeCount = Math.max(1, Math.min(20, count));
    
    const values: number[] = [];
    let total = 0;
    
    for (let i = 0; i < safeCount; i++) {
      const single = this.rollSingle(dieType);
      values.push(single.values[0]);
      total += single.values[0];
    }
    
    return {
      dieType,
      values,
      total,
      isPercentile: false // in multi-roll, we typically just treat them as individual values
    };
  }
}
