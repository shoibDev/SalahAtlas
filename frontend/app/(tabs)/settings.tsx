import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface SettingItemProps {
  icon: keyof typeof FontAwesome.glyphMap;
  label: string;
  onPress: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.itemContent}>
        <FontAwesome name={icon} size={20} color="#fff" style={styles.icon} />
        <Text style={styles.itemText}>{label}</Text>
      </View>
      <FontAwesome name="angle-right" size={18} color="#aaa" />
    </TouchableOpacity>
);

export default function SettingsScreen() {
  return (
      <ScrollView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
              source={require('@/assets/images/brand-banner.png')}
              style={styles.logo}
              resizeMode="contain"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingItem icon="cog" label="Theme" onPress={() => router.push('/settings/Theme')} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <SettingItem icon="bell" label="Notifications" onPress={() => router.push('/settings/Notifications')} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Misc</Text>
          <SettingItem icon="shield" label="Privacy Policy" onPress={() => router.push('/settings/PrivacyPolicy')} />
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F1A',
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
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  settingItem: {
    backgroundColor: '#131B2A',
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
    color: '#fff',
    fontSize: 16,
  },
});
