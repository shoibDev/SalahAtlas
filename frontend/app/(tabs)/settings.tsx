import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation();

  const SettingItem: ({icon, label, onPress}: { icon: any; label: any; onPress: any }) => React.JSX.Element = ({ icon, label, onPress }) => (
      <TouchableOpacity style={styles.settingItem} onPress={onPress}>
        <View style={styles.itemContent}>
          {/*<FontAwesome name={icon} size={20} color="#fff" style={styles.icon} />*/}
          <Text style={styles.itemText}>{label}</Text>
        </View>
        {/*<FontAwesome name="chevron-forward" size={18} color="#aaa" />*/}
      </TouchableOpacity>
  );

  return (
      <ScrollView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('@/assets/images/brand-banner.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingItem icon="moon" label="Theme" onPress={() => navigation.navigate('Theme')} />
          <SettingItem icon="language" label="Language" onPress={() => navigation.navigate('Language')} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <SettingItem icon="bell" label="Notifications" onPress={() => navigation.navigate('Notifications')} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Misc</Text>
          <SettingItem icon="shield-checkmark" label="Privacy Policy" onPress={() => navigation.navigate('PrivacyPolicy')} />
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
