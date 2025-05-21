import {createContext, PropsWithChildren, useState} from "react";
import {useRouter} from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

type AuthState = {
  isLoggedIn: boolean;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => void;
};

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  logIn: async () => {},
  logOut: () => {},
});

export function AuthProvider({ children }: PropsWithChildren ) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const logIn = async (email: string, password: string) => {
    try {
      console.log("Logging in with:", { email, password });

      const res = await axios.post("http://192.168.0.35:8080/auth/login", {
        email,
        password,
      });

      const { accessToken, refreshToken } = res.data.data;

      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken);

      console.log("Login successful. Token stored.");

      setIsLoggedIn(true);
      router.replace("/(protected)/(tabs)");
      console.log("Redirecting to tabs...");
      router.replace("/(protected)/(tabs)");
      console.log("Should be redirected now.");
    } catch (err: any) {
      console.log("Login failed:", err.message);
      console.log("Full error object:", err);
    }
  };

  const logOut = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

