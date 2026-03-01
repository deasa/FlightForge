export type Unit = 'ft' | 'yd';

export interface Disc {
  id: string;
  brand: string;
  model: string;
  speed: number;
  glide: number;
  turn: number;
  fade: number;
  notes?: string;
  bagId: string;
}

export interface Bag {
  id: string;
  name: string;
}

export interface Throw {
  id: string;
  discId: string;
  type: 'FH' | 'BH';
  distance: number; // Stored in feet internally
  date: string;
  notes?: string;
}

export interface UserProfile {
  unit: Unit;
  name: string;
  powerTier: number;
}
