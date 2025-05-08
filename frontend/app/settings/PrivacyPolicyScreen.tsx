import {View, Text} from "react-native";
import React from "react";

export default function PrivacyPolicyScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B0F1A' }}>
      <Text style={{ color: '#fff', fontSize: 18 }}>Privacy Policy</Text>
      <Text style={{ color: '#aaa', marginTop: 10, textAlign: 'center' }}>
        This is where the privacy policy content will go. Please refer to our website for more details.
      </Text>
    </View>
  )
}