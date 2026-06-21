export type DieBaseType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

export type DieType = DieBaseType | { type: 'custom', sides: number };

export interface RollResult {
  dieType: DieType;
  values: number[]; // For a d100, this could hold the tens and units if we want, but usually it's just the final value per die
  total: number;
  isPercentile: boolean;
  components?: number[]; // [tens, units] for d100
}

export function getSides(dieType: DieType): number {
  if (typeof dieType === 'string') {
    switch (dieType) {
      case 'd4': return 4;
      case 'd6': return 6;
      case 'd8': return 8;
      case 'd10': return 10;
      case 'd12': return 12;
      case 'd20': return 20;
      case 'd100': return 100;
    }
  } else {
    return dieType.sides;
  }
}

export function getDieName(dieType: DieType): string {
  if (typeof dieType === 'string') {
    return dieType;
  } else {
    return `d${dieType.sides}`;
  }
}
