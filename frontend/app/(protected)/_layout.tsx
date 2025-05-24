import {Redirect, Stack} from "expo-router"
import {useContext} from "react";
import {AuthContext} from "@/context/authContext";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};
export default function ProtectedLayout() {
  const authState = useContext(AuthContext);

  if(!authState.isLoggedIn) {
    return <Redirect href={"/login"} />
  }
  return (
    <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0D2B35' },
          headerTintColor: '#F3E9E2',
          headerTitleStyle: { fontWeight: '600' },
        }}
    >
      <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
    </Stack>
  )
}