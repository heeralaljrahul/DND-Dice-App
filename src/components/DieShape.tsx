import React from 'react';
import Svg, { Polygon, Circle } from 'react-native-svg';
import { DieType, getSides } from '../models/DieType';

interface DieShapeProps {
  dieType: DieType;
  size: number;
  color: string;
}

export const DieShape: React.FC<DieShapeProps> = ({ dieType, size, color }) => {
  const sides = getSides(dieType);

  switch (sides) {
    case 4:
      // Triangle
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Polygon points="50,10 90,90 10,90" fill={color} />
        </Svg>
      );
    case 6:
      // Square
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Polygon points="15,15 85,15 85,85 15,85" fill={color} rx="10" ry="10" />
        </Svg>
      );
    case 8:
      // Diamond
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Polygon points="50,10 90,50 50,90 10,50" fill={color} />
        </Svg>
      );
    case 10:
      // Kite (Pentagon variation)
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Polygon points="50,10 90,40 50,90 10,40" fill={color} />
        </Svg>
      );
    case 12:
      // Regular Pentagon
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Polygon points="50,5 95,38 78,90 22,90 5,38" fill={color} />
        </Svg>
      );
    case 20:
      // Hexagon (Classic icosahedron front)
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill={color} />
        </Svg>
      );
    case 100:
      // Circle (percentile)
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Circle cx="50" cy="50" r="45" fill={color} />
        </Svg>
      );
    default:
      // Circle for custom
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Circle cx="50" cy="50" r="45" fill={color} />
        </Svg>
      );
  }
};
