import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import JummahChat from '@/components/chat/JummahChat';
import ChatPreview from '@/components/chat/ChatPreview';
import {ChatProvider} from "@/context/ChatContext";
import {useAuth} from "@/context/authContext";
import { JummahDetail } from '@/types/jummah';
import { getJummahDetail } from '@/api/jummah';
import { useTheme } from '@/context/ThemeContext';


export default function JummahDetailScreen() {
  const theme = useTheme();
  const styles = StyleSheet.create(getStyles(theme));
  const { jummahId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<JummahDetail | null>(null);
  const [isAttendeeModalVisible, setAttendeeModalVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const user = { name: 'MobileUser' }; // TODO: Replace with actual auth context

  const { token } = useAuth();


  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await getJummahDetail(jummahId as string);
        setDetail(data);
      } catch (err) {
        console.error('Failed to fetch jummah details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [jummahId]);


  if (loading || !token) {
    return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
    );
  }

  const openAttendees = () => setAttendeeModalVisible(true);
  const closeAttendees = () => setAttendeeModalVisible(false);

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{detail!.date}</Text>

            <Text style={[styles.label, { marginTop: 12 }]}>Time</Text>
            <Text style={styles.value}>
              {detail!.time} ({detail!.prayerTime})
            </Text>
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.label}>Organizer</Text>
            <Text style={styles.value}>
              {detail!.organizer.firstName} {detail!.organizer.lastName}
              {detail!.organizer.verified && (
                  <Text style={styles.verified}> • Verified</Text>
              )}
            </Text>

            <TouchableOpacity onPress={openAttendees} style={{ marginTop: 16 }}>
              <Text style={[styles.value, styles.attendeeToggle]}>
                {detail!.attendees.length} attending
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Notes</Text>
          <Text style={styles.value}>{detail!.notes || 'None'}</Text>
        </View>

        <ChatProvider jummahId={jummahId as string}>
          <ChatPreview onExpand={() => setChatOpen(true)} />
          <JummahChat
              visible={chatOpen}
              onClose={() => setChatOpen(false)}
              username={user.name}
              token={token}
              jummahId={jummahId as string}
          />
        </ChatProvider>

        <Modal
            isVisible={isAttendeeModalVisible}
            onBackdropPress={closeAttendees}
            onBackButtonPress={closeAttendees}
            useNativeDriverForBackdrop
            backdropColor="#000"
            backdropOpacity={0.6}
            style={styles.modal}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Attendees</Text>
            {detail!.attendees.map((a: any) => (
                <Text key={a.id} style={styles.attendee}>
                  • {a.firstName} {a.lastName}
                  {a.verified && (
                      <Text style={styles.verified}> • Verified</Text>
                  )}
                </Text>
            ))}
            <TouchableOpacity onPress={closeAttendees} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
  );
}

const getStyles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.background,
        paddingHorizontal: 20,
        paddingTop: 16,
      },
      center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: theme.cardBackground,
        padding: 18,
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.surface,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
      },
      headerLeft: {
        flex: 1,
      },
      headerRight: {
        flex: 1,
        alignItems: 'flex-end',
      },
      label: {
        fontSize: 13,
        color: theme.textSecondary,
        fontWeight: '600',
        letterSpacing: 0.5,
      },
      value: {
        fontSize: 16,
        color: theme.textPrimary,
        fontWeight: '500',
        marginTop: 2,
        marginBottom: 6,
      },
      verified: {
        color: theme.accent,
        fontWeight: '700',
      },
      attendeeToggle: {
        marginTop: 8,
        fontWeight: '600',
        color: theme.accent,
        textDecorationLine: 'underline',
      },
      section: {
        backgroundColor: theme.cardBackground,
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: theme.surface,
      },
      modal: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        backgroundColor: theme.surface,
        padding: 24,
        borderRadius: 12,
        width: '90%',
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.textPrimary,
        marginBottom: 16,
      },
      attendee: {
        fontSize: 15,
        color: theme.textPrimary,
        marginBottom: 8,
      },
      closeButton: {
        marginTop: 20,
        backgroundColor: theme.buttonBackground,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
      },
      closeButtonText: {
        color: theme.buttonText,
        fontWeight: '600',
        fontSize: 15,
      },
    });