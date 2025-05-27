import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import { useTheme } from "@/context/ThemeContext";

export default function VerificationScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const theme = useTheme();

  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    if (/^\d$/.test(text)) {
      const updated = [...code];
      updated[index] = text;
      setCode(updated);
      if (index < 5) inputs.current[index + 1]?.focus();
    } else if (text === "") {
      const updated = [...code];
      updated[index] = "";
      setCode(updated);
    }
  };

  const handleKeyPress = (
      e: NativeSyntheticEvent<TextInputKeyPressEventData>,
      index: number
  ) => {
    const { key } = e.nativeEvent;
    if (key === "Backspace") {
      if (code[index]) {
        const updated = [...code];
        updated[index] = "";
        setCode(updated);
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
        const updated = [...code];
        updated[index - 1] = "";
        setCode(updated);
      }
    }
  };

  const handleSubmit = async () => {
    const otp = code.join("");
    if (otp.length < 6) {
      console.warn("Please enter all 6 digits.");
      return;
    }
    console.log("OTP Submitted:", otp);
    // TODO: Trigger actual OTP API submission here
    try {
      const response = await fetch(
          `http://192.168.0.35:8080/auth/verify?code=${otp}&email=${email}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Verification success:", data.message);
        router.replace("/login")
      } else {
        console.warn("❌ Verification failed:", data.message || "Unknown error");
        // Show error UI
      }
    } catch (error) {
      console.error("🚨 Network error:", error);
      // Handle network errors
    }
  };

  const styles = getStyles(theme);

  return (
      <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.container}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>We sent a 6-digit code to</Text>
          <Text style={styles.email}>{email ?? "your email"}</Text>

          <View style={styles.inputContainer}>
            {code.map((digit, index) => (
                <TextInput
                    key={index}
                    ref={(ref) => (inputs.current[index] = ref)}
                    value={digit}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    keyboardType="number-pad"
                    maxLength={1}
                    style={[
                      styles.input,
                      focusedIndex === index && styles.inputFocused,
                    ]}
                    autoFocus={index === 0}
                    caretHidden={true}
                    textContentType="oneTimeCode"
                    importantForAutofill="yes"
                    allowFontScaling={false}
                />
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
  );
}

const getStyles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.background,
        justifyContent: "center",
      },
      innerContainer: {
        alignSelf: "center",
        width: "90%",
        maxWidth: 400,
        alignItems: "center",
      },
      title: {
        fontSize: 24,
        color: theme.textPrimary,
        fontWeight: "bold",
        marginBottom: 10,
      },
      subtitle: {
        fontSize: 16,
        color: theme.textSecondary,
      },
      email: {
        fontSize: 16,
        color: theme.accent,
        marginBottom: 30,
      },
      inputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 30,
      },
      input: {
        backgroundColor: theme.cardBackground,
        color: theme.textPrimary,
        fontSize: 22,
        borderRadius: 12,
        textAlign: "center",
        width: 50,
        height: 60,
        marginHorizontal: 5,
        borderWidth: 2,
        borderColor: theme.surface,
      },
      inputFocused: {
        borderColor: theme.accent,
        shadowColor: theme.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        elevation: 8, // Android glow
      },
      button: {
        backgroundColor: theme.buttonBackground,
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 12,
        alignItems: "center",
      },
      buttonText: {
        color: theme.buttonText,
        fontWeight: "600",
        fontSize: 16,
      },
    });
