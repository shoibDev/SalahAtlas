import React, { createContext, useContext, ReactNode } from 'react';

export const colors = {
  background: '#0D2B35',
  backgroundTexture: require('@/assets/textures/absurdity.png'),
  surface: '#F3E9E2',
  textPrimary: '#F3E9E2',
  textSecondary: '#C9886B',
  accent: '#C9886B',
  cardBackground: '#F3E9E2',
  buttonBackground: '#C9886B',
  buttonText: '#F3E9E2',
};

type Theme = typeof colors;

const ThemeContext = createContext<Theme>(colors);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return <ThemeContext.Provider value={colors}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
