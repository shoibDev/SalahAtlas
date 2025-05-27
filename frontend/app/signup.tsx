import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  Animated as RNAnimated,
  Image,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "@/context/ThemeContext";

const { width } = Dimensions.get("window");

export default function SignupScreen() {
  const theme = useTheme();
  const router = useRouter();
  const shiftAnim = useRef(new RNAnimated.Value(0)).current;

  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState("MALE");
  const [firstName, setFirstName] = useState("test");
  const [lastName, setLastName] = useState("test");
  const [email, setEmail] = useState("shoibwahab001@gmail.com");
  const [password, setPassword] = useState("test");
  const [confirmPassword, setConfirmPassword] = useState("test");

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

  const handleSignup = async () => {

    try {
      const response = await fetch("http://192.168.0.35:8080/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          gender,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Signup failed: Server error";
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          }
        } catch (jsonError) {
          console.warn("Failed to parse error response JSON.");
        }

        alert(errorMessage);
        return;
      }

      alert("Signup successful! Please verify your email.");
    router.push({ pathname: "/verification", params: { email } });
    } catch (error: any) {
      console.error("Network or client error:", error.message);
      alert("Signup failed: Network error or invalid setup");
    }
  };

  const styles = getStyles(theme);

  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <RNAnimated.View style={{ transform: [{ translateY: shiftAnim }] }}>
            <Animated.Text entering={FadeInUp.delay(200)} style={styles.title}>
              Create Your Account
            </Animated.Text>

            <Animated.View entering={FadeInUp.delay(400)} style={styles.inputWrapper}>
              <View style={styles.row}>
                <TextInput
                    placeholder="First Name"
                    placeholderTextColor={theme.placeholder}
                    style={[styles.inputHalf, { marginRight: 10 }]}
                    value={firstName}
                    onChangeText={setFirstName}
                />
                <TextInput
                    placeholder="Last Name"
                    placeholderTextColor={theme.placeholder}
                    style={styles.inputHalf}
                    value={lastName}
                    onChangeText={setLastName}
                />
              </View>

              <TextInput
                  placeholder="Email"
                  placeholderTextColor={theme.placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
              />

              <View style={styles.passwordContainer}>
                <TextInput
                    placeholder="Password"
                    placeholderTextColor={theme.placeholder}
                    secureTextEntry={!showPassword}
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} style={{ marginLeft: 10 }}>
                  <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor={theme.placeholder}
                  secureTextEntry
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
              />

              {password !== confirmPassword && confirmPassword.length > 0 && (
                  <Text style={styles.errorText}>Passwords do not match</Text>
              )}

              <View style={styles.genderContainer}>
                {["MALE", "FEMALE"].map((g) => (
                    <TouchableOpacity
                        key={g}
                        onPress={() => setGender(g)}
                        style={[
                          styles.genderBox,
                          gender === g && styles.genderSelected,
                        ]}
                    >
                      <Image
                          source={
                            g === "MALE"
                                ? require("@/assets/images/boy.png")
                                : require("@/assets/images/girl.png")
                          }
                          style={styles.genderImage}
                          resizeMode="contain"
                      />
                      <Text style={styles.genderLabel}>{g === "MALE" ? "Male" : "Female"}</Text>
                    </TouchableOpacity>
                ))}
              </View>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(600)}>
              <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.Text entering={FadeInUp.delay(800)} style={styles.footerText}>
              In the name of Allah, the Most Gracious, the Most Merciful
            </Animated.Text>

            <TouchableOpacity onPress={() => router.replace("/login")} style={styles.linkContainer}>
              <Text style={styles.linkText}>
                Already have an account? <Text style={styles.linkTextHighlight}>Log in</Text>
              </Text>
            </TouchableOpacity>
          </RNAnimated.View>
        </View>
      </TouchableWithoutFeedback>
  );
}

const getStyles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
      container: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.background,
      },
      title: {
        fontSize: 28,
        color: theme.textPrimary,
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
        backgroundColor: theme.cardBackground,
        color: theme.textPrimary,
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
        backgroundColor: theme.cardBackground,
        borderRadius: 12,
        paddingHorizontal: 10,
        height: 50,
        marginBottom: 15,
        width: "100%",
      },
      button: {
        backgroundColor: theme.accent,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 14,
        width: "100%",
        alignItems: "center",
        shadowColor: theme.accent,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 4,
      },
      buttonText: {
        color: theme.buttonText,
        fontSize: 17,
        fontWeight: "bold",
      },
      footerText: {
        marginTop: 40,
        fontSize: 14,
        color: theme.textSecondary,
        textAlign: "center",
      },
      linkContainer: {
        marginTop: 15,
        alignItems: "center",
      },
      linkText: {
        color: theme.textSecondary,
        fontSize: 14,
      },
      linkTextHighlight: {
        color: theme.accent,
        fontWeight: "bold",
      },
      row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
      },
      inputHalf: {
        backgroundColor: theme.cardBackground,
        color: theme.textPrimary,
        height: 50,
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 16,
        flex: 1,
      },
      errorText: {
        color: theme.error || "#F87171",
        fontSize: 14,
        marginBottom: 10,
        textAlign: "left",
      },
      genderContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        marginBottom: 20,
      },
      genderBox: {
        flex: 1,
        backgroundColor: theme.cardBackground,
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: theme.surface,
      },
      genderSelected: {
        borderColor: theme.accent,
        shadowColor: theme.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 12,
        elevation: 6,
      },
      genderImage: {
        width: 48,
        height: 48,
        marginBottom: 8,
      },
      genderLabel: {
        color: theme.textPrimary,
        fontSize: 14,
        fontWeight: "500",
      },
    });
