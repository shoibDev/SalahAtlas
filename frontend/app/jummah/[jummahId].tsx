import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import JummahChat from '@/components/JummahChat';
import ChatPreview from '@/components/ChatPreview';

export default function JummahDetailScreen() {
  const { jummahId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<any>(null);
  const [isAttendeeModalVisible, setAttendeeModalVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const user = { name: 'Test User' };
  const authToken = 'YOUR_JWT_TOKEN';

  const [messages, setMessages] = useState([
    { sender: 'Ali', message: 'Asalaamu Alaikum!', type: 'CHAT' },
    { sender: 'Sarah', message: 'Wa Alaikum Salaam!', type: 'CHAT' },
    { sender: 'Yusuf', message: 'Looking forward to Jummah.', type: 'CHAT' },
    { sender: 'Yusuf', message: 'Looking forward to Jummah.', type: 'CHAT' },
    { sender: 'Yusuf', message: 'Looking forward to Jummah.', type: 'CHAT' },
    { sender: 'Yusuf', message: 'Looking forward to Jummah.', type: 'CHAT' },
    { sender: 'Yusuf', message: 'Looking forward to Jummah.', type: 'CHAT' },
    { sender: 'Yusuf', message: 'Looking forward to Jummah.', type: 'CHAT' },
    { sender: 'Yusuf', message: 'Looking forward to Jummah.', type: 'CHAT' },
    { sender: 'Yusuf', message: 'Looking forward to Jummah.', type: 'CHAT' },
    { sender: 'Yusuf', message: 'Looking forward to Jummah.', type: 'CHAT' },
    { sender: 'Yusuf', message: 'Looking forward to Jummah.', type: 'CHAT' },
    { sender: 'Yusuf', message: 'Looking forward to Jummah.', type: 'CHAT' },
    { sender: 'Yusuf', message: 'Looking forward to Jummah.', type: 'CHAT' },
    { sender: 'Yusuf', message: 'Looking forward to Jummah.', type: 'CHAT' },
    { sender: 'Yusuf', message: 'Looking forward to Jummah.', type: 'CHAT' },

  ]);

  useEffect(() => {
    const fetchDetails = async () => {
      await new Promise((res) => setTimeout(res, 800));

      const mockedResponse = {
        id: jummahId,
        date: '2025-05-17',
        time: '13:15',
        prayerTime: 'DHUHR',
        notes: 'Please arrive 10 minutes early to help with setup.',
        organizer: {
          id: 'org-123',
          firstName: 'Shoib',
          lastName: 'Wahab',
          verified: true,
        },
        attendees: [
          { id: 'a1', firstName: 'Sarah', lastName: 'Ahmed', verified: false },
          { id: 'a2', firstName: 'Yusuf', lastName: 'Rahman', verified: true },
          { id: 'a3', firstName: 'Layla', lastName: 'Omar', verified: false },
        ],
      };

      setDetail(mockedResponse);
      setLoading(false);
    };

    fetchDetails();
  }, [jummahId]);

  if (loading) {
    return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
    );
  }

  const openAttendees = () => setAttendeeModalVisible(true);
  const closeAttendees = () => setAttendeeModalVisible(false);

  return (
      < View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{detail.date}</Text>

            <Text style={[styles.label, { marginTop: 12 }]}>Time</Text>
            <Text style={styles.value}>
              {detail.time} ({detail.prayerTime})
            </Text>
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.label}>Organizer</Text>
            <Text style={styles.value}>
              {detail.organizer.firstName} {detail.organizer.lastName}
              {detail.organizer.verified && (
                  <Text style={styles.verified}> • Verified</Text>
              )}
            </Text>

            <TouchableOpacity onPress={openAttendees} style={{ marginTop: 16 }}>
              <Text style={[styles.value, styles.attendeeToggle]}>
                {detail.attendees.length} attending
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Notes</Text>
          <Text style={styles.value}>{detail.notes || 'None'}</Text>
        </View>

        <ChatPreview messages={messages} onExpand={() => setChatOpen(true)} />

        <JummahChat
            visible={chatOpen}
            onClose={() => setChatOpen(false)}
            jummahId={jummahId as string}
            username={user.name}
            token={authToken}
            messages={messages}
            setMessages={setMessages}
        />

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
            {detail.attendees.map((a: any) => (
                <Text key={a.id} style={styles.attendee}>
                  • {a.firstName} {a.lastName}
                  {a.verified && <Text style={styles.verified}> • Verified</Text>}
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

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#111827',
    minHeight: '100%',
  },
  center: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 28,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#f3f4f6',
  },
  verified: {
    color: '#133383',
    fontWeight: '500',
  },
  attendeeToggle: {
    color: '#133383',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1f2937',
    padding: 24,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: 16,
  },
  attendee: {
    fontSize: 15,
    color: '#f9fafb',
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#133383',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
