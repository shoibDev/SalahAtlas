// ThemeContext.ts
import React, { createContext, useContext, ReactNode } from 'react';

export const colors = {
  background: '#0D2B35',
  backgroundTexture: require('@/assets/textures/absurdity.png'),
  blackThreadBackground: require('@/assets/textures/black_thread2.png'),
  surface: '#163946',
  textPrimary: '#F3E9E2',
  textSecondary: '#C9886B',
  accent: '#FFAD66',
  cardBackground: '#122E38',
  buttonBackground: '#C9886B',
  buttonText: '#FFFFFF',
  placeholder: '#7A9CA4', // ✅ Added for input placeholders
};

type Theme = typeof colors;

const ThemeContext = createContext<Theme>(colors);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return <ThemeContext.Provider value={colors}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
