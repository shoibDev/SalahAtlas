import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
  useContext,
} from 'react';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import {LoginRequest} from "@/types/auth";
import {login} from "@/api/authApi";

type AuthState = {
  isLoggedIn: boolean;
  token: string | null;
  userId: string | null;
  logIn: (request: LoginRequest) => Promise<void>;
  logOut: () => void;
};

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  token: null,
  userId: null,
  logIn: async () => {},
  logOut: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // Load token and user ID on app start
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = await SecureStore.getItemAsync('accessToken');
      const storedUserId = await SecureStore.getItemAsync('userId');
      if (storedToken) {
        setToken(storedToken);
        setUserId(storedUserId);
        setIsLoggedIn(true);
      }
    };
    restoreSession();
  }, []);

  const logIn = async (request: LoginRequest) => {
    try {
      const { accessToken, refreshToken, userId } = await login(request);

      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      await SecureStore.setItemAsync('userId', userId);

      setToken(accessToken);
      setUserId(userId);
      setIsLoggedIn(true);

      console.log('Login successful. Token and user ID stored.');
      router.replace('/(protected)/(tabs)');
    } catch (err: any) {
      console.error('Login failed:', err.message);
    }
  };

  const logOut = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('userId');
    setToken(null);
    setUserId(null);
    setIsLoggedIn(false);
  };

  return (
      <AuthContext.Provider value={{ isLoggedIn, token, userId, logIn, logOut }}>
        {children}
      </AuthContext.Provider>
  );
}

// Optional: convenient hook
export const useAuth = () => useContext(AuthContext);
