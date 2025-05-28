/**
 * Theme-related type definitions
 */

import { ImageSourcePropType } from 'react-native';

/**
 * Theme colors and assets
 */
export interface Theme {
  background: string;
  absurdityTexture: ImageSourcePropType;
  blackThreadBackground: ImageSourcePropType;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  cardBackground: string;
  buttonBackground: string;
  buttonText: string;
  placeholder: string;
}