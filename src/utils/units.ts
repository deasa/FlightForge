import { Unit } from '../types';

export const formatDistance = (distanceFt: number, unit: Unit): string => {
  if (unit === 'yd') {
    const yards = distanceFt / 3;
    // Show 1 decimal place for yards if it's not a whole number
    const formattedYards = yards % 1 === 0 ? yards.toString() : yards.toFixed(1);
    return `${formattedYards} yd`;
  }
  return `${Math.round(distanceFt)} ft`;
};

export const convertToFt = (distance: number, unit: Unit): number => {
  if (unit === 'yd') {
    return distance * 3;
  }
  return distance;
};

export const convertFromFt = (distanceFt: number, unit: Unit): number => {
  if (unit === 'yd') {
    return distanceFt / 3;
  }
  return distanceFt;
};
