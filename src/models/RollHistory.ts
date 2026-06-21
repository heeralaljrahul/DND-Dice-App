export interface RollHistoryEntry {
  id: string;
  label: string; // e.g. "1d20" or "3d6"
  total: number;
  values: number[];
  timestamp: number;
}
