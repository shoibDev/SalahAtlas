import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
  useContext,
} from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

type AuthState = {
  isLoggedIn: boolean;
  token: string | null;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => void;
};

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  token: null,
  logIn: async () => {},
  logOut: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Load token on app start
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = await SecureStore.getItemAsync('accessToken');
      if (storedToken) {
        setToken(storedToken);
        setIsLoggedIn(true);
      }
    };
    restoreSession();
  }, []);

  const logIn = async (email: string, password: string) => {
    try {
      console.log('Logging in with:', { email, password });

      const res = await axios.post('http://192.168.0.35:8080/auth/login', {
        email,
        password,
      });

      const { accessToken, refreshToken } = res.data.data;

      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);

      setToken(accessToken);
      setIsLoggedIn(true);

      console.log('Login successful. Token stored.');
      router.replace('/(protected)/(tabs)');
    } catch (err: any) {
      console.error('Login failed:', err.message);
    }
  };

  const logOut = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
      <AuthContext.Provider value={{ isLoggedIn, token, logIn, logOut }}>
        {children}
      </AuthContext.Provider>
  );
}

// Optional: convenient hook
export const useAuth = () => useContext(AuthContext);
