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
    <Stack>
      <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
    </Stack>
  )
}