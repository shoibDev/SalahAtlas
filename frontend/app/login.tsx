import { useRouter } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  Animated as RNAnimated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "@/context/authContext";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { validateLogin } from "@/validation/login";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const { logIn } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const shiftAnim = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => {
      RNAnimated.timing(shiftAnim, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    const hide = Keyboard.addListener("keyboardDidHide", () => {
      RNAnimated.timing(shiftAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const errors = validateLogin(form);
    if (errors.length > 0) {
      console.log("Validation error:", errors[0]);
      return;
    }

    try {
      console.log("Logging in with:", form);
      await logIn(form.email, form.password);
      router.replace("/");
    } catch (err: any) {
      console.log("Login failed:", err?.response?.data?.message || err.message || "Unknown error");
    }
  };

  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient colors={["#0D1B2A", "#1B263B", "#0D1B2A"]} style={styles.container}>
          <RNAnimated.View style={{ transform: [{ translateY: shiftAnim }] }}>
            {/* Crescent Icon */}
            <Animated.View entering={FadeInDown.delay(100)} style={styles.iconContainer}>
              <Svg height="100" width="100" viewBox="0 0 64 64">
                <Path
                    d="M45.6,32c0-9.2-5.4-17.1-13.3-20.7C34.7,12.5,36,16.1,36,20c0,11-9,20-20,20c-3.9,0-7.5-1.3-10.7-3.7
                C14.9,58.6,45.6,50.6,45.6,32z"
                    fill="#F4C430"
                />
              </Svg>
            </Animated.View>

            {/* Title */}
            <Animated.Text entering={FadeInUp.delay(200)} style={styles.title}>
              Welcome Back
            </Animated.Text>

            {/* Input Fields */}
            <Animated.View entering={FadeInUp.delay(400)} style={styles.inputWrapper}>
              <TextInput
                  placeholder="Email"
                  placeholderTextColor="#aaa"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={(text) => handleChange("email", text)}
              />

              <View style={styles.passwordContainer}>
                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry={!showPassword}
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    value={form.password}
                    onChangeText={(text) => handleChange("password", text)}
                />
                <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} style={{ marginLeft: 10 }}>
                  <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={20} color="#aaa" />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Login Button */}
            <Animated.View entering={FadeInUp.delay(600)}>
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Footer */}
            <Animated.Text entering={FadeInUp.delay(800)} style={styles.footerText}>
              In the name of Allah, the Most Gracious, the Most Merciful
            </Animated.Text>

            <TouchableOpacity onPress={() => router.replace("/signup")} style={styles.linkContainer}>
              <Text style={styles.linkText}>
                Don’t have an account? <Text style={styles.linkTextHighlight}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </RNAnimated.View>
        </LinearGradient>
      </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    color: "#F9FAFB",
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
  },
  inputWrapper: {
    width: width * 0.9,
    alignSelf: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#1E293B",
    color: "#fff",
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    width: "100%",
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 15,
    width: "100%",
  },
  button: {
    backgroundColor: "#F4C430",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
    shadowColor: "#F4C430",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonText: {
    color: "#0D1B2A",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 40,
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
  },
  linkContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    color: "#94A3B8",
    fontSize: 14,
  },
  linkTextHighlight: {
    color: "#F4C430",
    fontWeight: "bold",
  },
});
