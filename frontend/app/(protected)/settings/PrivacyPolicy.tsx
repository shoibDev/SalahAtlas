import { View, Text, StyleSheet } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
      <>
        <View style={styles.container}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.content}>This is the Privacy Policy...</Text>
        </View>
      </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#0B0F1A' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  content: { color: '#aaa', fontSize: 16 },
});
