import { Disc, Throw } from '../types';

export const getSmartLabels = (disc: Disc): string[] => {
  const labels: string[] = [];
  
  if (disc.turn <= -2.5) labels.push('Highly Understable');
  else if (disc.turn <= -1.0) labels.push('Understable');
  else if (disc.turn >= -0.5 && disc.turn <= 0.5 && disc.fade <= 2) labels.push('Stable');
  
  if (disc.fade >= 4) labels.push('Highly Overstable');
  else if (disc.fade >= 3) labels.push('Overstable');
  
  if (disc.speed >= 9 && disc.fade >= 3) labels.push('Wind Fighter');
  if (disc.speed <= 3 && disc.fade <= 1) labels.push('Approach / Putt');
  if (disc.speed >= 12 && disc.turn <= -2) labels.push('Max Distance (Tailwind)');
  
  return labels;
};

export const calculatePowerTier = (maxDistanceFt: number): number => {
  if (maxDistanceFt < 200) return 1; // Beginner
  if (maxDistanceFt < 300) return 2; // Novice
  if (maxDistanceFt < 350) return 3; // Intermediate
  if (maxDistanceFt < 400) return 4; // Advanced
  if (maxDistanceFt < 450) return 5; // Expert
  return 6; // Pro
};

export const getPowerTierName = (tier: number): string => {
  const names = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Expert', 'Pro'];
  return names[tier - 1] || 'Unknown';
};

export const getExpectedDistance = (speed: number, powerTier: number): number => {
  // Rough estimation of expected distance based on speed and power tier
  const baseMultiplier = 25 + (powerTier * 5); // 30, 35, 40, 45, 50, 55
  return speed * baseMultiplier;
};

export const getUntappedPotential = (disc: Disc, maxDistance: number, powerTier: number): number => {
  const expected = getExpectedDistance(disc.speed, powerTier);
  if (maxDistance < expected * 0.85) {
    return Math.round(expected - maxDistance);
  }
  return 0;
};
