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
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import {useRouter} from "expo-router"; // For gender selection

const { width } = Dimensions.get("window");

export default function SignupScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState<"MALE" | "FEMALE" | undefined>(undefined);
  const shiftAnim = useRef(new RNAnimated.Value(0)).current;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


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

  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
            colors={["#0D1B2A", "#1B263B", "#0D1B2A"]}
            style={styles.container}
        >
          <RNAnimated.View style={{ transform: [{ translateY: shiftAnim }] }}>
            {/* Title */}
            <Animated.Text entering={FadeInUp.delay(200)} style={styles.title}>
              Create Account
            </Animated.Text>

            {/* Input Fields */}
            <Animated.View entering={FadeInUp.delay(400)} style={styles.inputWrapper}>
              <View style={styles.row}>
                <TextInput
                    placeholder="First Name"
                    placeholderTextColor="#aaa"
                    style={[styles.inputHalf, { marginRight: 10 }]}
                />
                <TextInput
                    placeholder="Last Name"
                    placeholderTextColor="#aaa"
                    style={styles.inputHalf}
                />
              </View>

              <TextInput
                  placeholder="Email"
                  placeholderTextColor="#aaa"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
              />

              <View style={styles.passwordContainer}>
                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry={!showPassword}
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                    style={{ marginLeft: 10 }}
                >
                  <FontAwesome
                      name={showPassword ? "eye" : "eye-slash"}
                      size={20}
                      color="#aaa"
                  />
                </TouchableOpacity>
              </View>

              <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  style={styles.input}
                  onChangeText={(text) => setConfirmPassword(text)}
              />

              <Text style={[styles.errorText, password !== confirmPassword && confirmPassword ? {} : { opacity: 0 }]}>
                Passwords do not match
              </Text>

              {/* Custom Gender Picker */}
              <View style={styles.genderContainer}>
                <TouchableOpacity
                    onPress={() => setGender("MALE")}
                    style={[
                      styles.genderBox,
                      gender === "MALE" && styles.genderSelectedBlue,
                    ]}
                >
                  <Image
                      source={require("@/assets/images/boy.png")}
                      style={styles.genderImage}
                      resizeMode="contain"
                  />
                  <Text style={styles.genderLabel}>Male</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setGender("FEMALE")}
                    style={[
                      styles.genderBox,
                      gender === "FEMALE" && styles.genderSelectedPink,
                    ]}
                >
                  <Image
                      source={require("@/assets/images/girl.png")}
                      style={styles.genderImage}
                      resizeMode="contain"
                  />
                  <Text style={styles.genderLabel}>Female</Text>
                </TouchableOpacity>
              </View>

            </Animated.View>

            {/* Signup Button */}
            <Animated.View entering={FadeInUp.delay(600)}>
              <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    console.log("Signup info submitted");
                    // Add API call here
                  }}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Footer */}
            <Animated.Text entering={FadeInUp.delay(800)} style={styles.footerText}>
              In the name of Allah, the Most Gracious, the Most Merciful
            </Animated.Text>

            <TouchableOpacity onPress={() => router.replace("/login")} style={styles.linkContainer}>
              <Text style={styles.linkText}>
                Already have an account? <Text style={styles.linkTextHighlight}>Log in</Text>
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
  pickerWrapper: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
  },
  picker: {
    height: 50,
    color: "#fff",
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  inputHalf: {
    backgroundColor: "#1E293B",
    color: "#fff",
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    flex: 1,
  },
  errorText: {
    color: "#F87171",
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
    backgroundColor: "#1E293B",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
    elevation: 4,
  },
  genderSelectedBlue: {
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  genderSelectedPink: {
    shadowColor: "#EC4899",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#EC4899",
  },
  genderImage: {
    width: 50,
    height: 50,
    marginBottom: 6,
  },
  genderLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },

});
