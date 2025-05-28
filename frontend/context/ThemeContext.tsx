/**
 * Theme context for the application
 */
import React, { createContext, useContext, ReactNode } from 'react';
import { Theme } from '@/types/theme';

/**
 * Default theme colors and assets
 */
export const colors: Theme = {
  background: '#0D2B35',
  absurdityTexture: require('@/assets/textures/absurdity.png'),
  blackThreadBackground: require('@/assets/textures/black_thread2.png'),
  surface: '#163946',
  textPrimary: '#F3E9E2',
  textSecondary: '#C9886B',
  accent: '#FFAD66',
  cardBackground: '#122E38',
  buttonBackground: '#C9886B',
  buttonText: '#FFFFFF',
  placeholder: '#7A9CA4',
};

// Create context with default theme
const ThemeContext = createContext<Theme>(colors);

/**
 * Theme provider component
 */
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <ThemeContext.Provider value={colors}>{children}</ThemeContext.Provider>;
};

/**
 * Hook to use the theme context
 * @returns The current theme
 */
export const useTheme = (): Theme => useContext(ThemeContext);
