import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AuthContext } from '@/context/authContext';
import { useTheme } from '@/context/ThemeContext';

interface SettingItemProps {
  icon: keyof typeof FontAwesome.glyphMap;
  label: string;
  onPress: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, label, onPress }) => {
  const theme = useTheme();

  return (
      <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.surface }]}
          onPress={onPress}
      >
        <View style={styles.itemContent}>
          <FontAwesome name={icon} size={20} color={theme.accent} style={styles.icon} />
          <Text style={[styles.itemText, { color: theme.background }]}>{label}</Text>
        </View>
        <FontAwesome name="angle-right" size={18} color={theme.accent} />
      </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const authState = useContext(AuthContext);
  const theme = useTheme();

  const handleLogout = () => {
    authState.logOut();
    router.replace('/login');
  };

  return (
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.logoContainer}>
          {/* You can uncomment and re-enable when you have a properly styled image */}
          {/*<Image
          source={require('@/assets/images/brand-banner.png')}
          style={styles.logo}
          resizeMode="contain"
        />*/}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Preferences</Text>
          <SettingItem icon="cog" label="Theme" onPress={() => router.push('/settings/Theme')} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>General</Text>
          <SettingItem icon="bell" label="Notifications" onPress={() => router.push('/settings/Notifications')} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Misc</Text>
          <SettingItem icon="shield" label="Privacy Policy" onPress={() => router.push('/settings/PrivacyPolicy')} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Account</Text>
          <SettingItem icon="sign-out" label="Log Out" onPress={handleLogout} />
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 1000,
    height: 300,
    marginBottom: -100,
    alignSelf: 'center',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  settingItem: {
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
  },
});
