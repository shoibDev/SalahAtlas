import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import JummahChat from '@/components/chat/JummahChat';
import ChatPreview from '@/components/chat/ChatPreview';
import {ChatProvider} from "@/context/ChatContext";
import {useAuth} from "@/context/authContext";
import { JummahDetail } from '@/types/jummah';
import { getJummahDetail, joinJummah, leaveJummah, removeAttendee, deleteJummah } from '@/api/jummahApi';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';

export default function JummahDetailScreen() {
  const theme = useTheme();
  const styles = StyleSheet.create(getStyles(theme));
  const { jummahId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<JummahDetail | null>(null);
  const [isAttendeeModalVisible, setAttendeeModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const { token, userId } = useAuth();

  // Use the real user ID from AuthContext
  const currentUserId = userId || "";


  // Check if current user is the organizer
  const isOrganizer = detail?.organizer?.id === currentUserId;

  // Check if current user is an attendee
  const isAttendee = detail?.attendees?.some(attendee => attendee.id === currentUserId);

  // Handle joining a Jummah
  const handleJoin = async () => {
    if (!jummahId || isJoining) return;

    setIsJoining(true);
    try {
      const success = await joinJummah(jummahId as string, currentUserId);
      if (success) {
        // Refresh the details to show updated attendee list
        const data = await getJummahDetail(jummahId as string);
        setDetail(data);
        Alert.alert("Success", "You have joined this Jummah");
      }
    } catch (error) {
      console.error("Failed to join Jummah:", error);
      Alert.alert("Error", "Failed to join this Jummah");
    } finally {
      setIsJoining(false);
    }
  };

  // Handle leaving a Jummah
  const handleLeave = async () => {
    if (!jummahId || isLeaving) return;

    setIsLeaving(true);
    try {
      const success = await leaveJummah(jummahId as string, currentUserId);
      if (success) {
        // Refresh the details to show updated attendee list
        const data = await getJummahDetail(jummahId as string);
        setDetail(data);
        Alert.alert("Success", "You have left this Jummah");
      }
    } catch (error) {
      console.error("Failed to leave Jummah:", error);
      Alert.alert("Error", "Failed to leave this Jummah");
    } finally {
      setIsLeaving(false);
    }
  };

  // Handle removing an attendee (only for organizer)
  const handleRemoveAttendee = async (attendeeId: string) => {
    if (!jummahId || !isOrganizer) return;

    try {
      const success = await removeAttendee(jummahId as string, attendeeId);
      if (success) {
        // Refresh the details to show updated attendee list
        const data = await getJummahDetail(jummahId as string);
        setDetail(data);
        Alert.alert("Success", "Attendee removed successfully");
        setAttendeeModalVisible(false);
      }
    } catch (error) {
      console.error("Failed to remove attendee:", error);
      Alert.alert("Error", "Failed to remove attendee");
    }
  };

  // Handle deleting a Jummah (only for organizer)
  const handleDelete = async () => {
    if (!jummahId || !isOrganizer || isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteJummah(jummahId as string);
      Alert.alert("Success", "Jummah deleted successfully");
      router.back(); // Navigate back after deletion
    } catch (error) {
      console.error("Failed to delete Jummah:", error);
      Alert.alert("Error", "Failed to delete Jummah");
    } finally {
      setIsDeleting(false);
      setDeleteModalVisible(false);
    }
  };

  // Show delete confirmation modal
  const confirmDelete = () => {
    setDeleteModalVisible(true);
  };

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

        {/* Join/Leave buttons (only for non-owners) */}
        {!isOrganizer && (
          <View style={styles.actionButtonsContainer}>
            {!isAttendee ? (
              <TouchableOpacity
                style={[styles.actionButton, styles.joinButton]}
                onPress={handleJoin}
                disabled={isJoining}
              >
                <Text style={styles.actionButtonText}>
                  {isJoining ? 'Joining...' : 'Join Jummah'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.actionButton, styles.leaveButton]}
                onPress={handleLeave}
                disabled={isLeaving}
              >
                <Text style={styles.actionButtonText}>
                  {isLeaving ? 'Leaving...' : 'Leave Jummah'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Delete button (only for owner) */}
        {isOrganizer && (
            <View style={{ alignItems: 'flex-end', marginBottom: 20 }}>
              <TouchableOpacity onPress={() => setDeleteModalVisible(true)} style={styles.optionsIcon}>
                <Ionicons name="ellipsis-vertical" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
        )}

        <ChatProvider jummahId={jummahId as string}>
          <ChatPreview
              onExpand={() =>
                  router.push({
                    pathname: '/(protected)/chat/[jummahId]',
                    params: { jummahId: jummahId as string },
                  })
              }
          />
        </ChatProvider>

        {/* Attendees Modal */}
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
                <View key={a.id} style={styles.attendeeRow}>
                  <Text style={styles.attendee}>
                    • {a.firstName} {a.lastName}
                    {a.verified && (
                        <Text style={styles.verified}> • Verified</Text>
                    )}
                  </Text>
                  {/* Remove button (only for organizer) */}
                  {isOrganizer && a.id !== detail!.organizer.id && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveAttendee(a.id)}
                    >
                      <Ionicons name="remove-circle-outline" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                  )}
                </View>
            ))}
            <TouchableOpacity onPress={closeAttendees} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
            isVisible={isDeleteModalVisible}
            onBackdropPress={() => setDeleteModalVisible(false)}
            onBackButtonPress={() => setDeleteModalVisible(false)}
            useNativeDriverForBackdrop
            backdropColor="#000"
            backdropOpacity={0.6}
            style={styles.modal}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Jummah</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this Jummah? This action cannot be undone.
            </Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleDelete}
                disabled={isDeleting}
              >
                <Text style={styles.modalButtonText}>
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Text>
              </TouchableOpacity>
            </View>
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
      // Action buttons styles
      actionButtonsContainer: {
        marginBottom: 20,
      },
      actionButton: {
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      },
      joinButton: {
        backgroundColor: '#4CAF50', // Green
      },
      leaveButton: {
        backgroundColor: '#FF9800', // Orange
      },
      deleteButton: {
        backgroundColor: '#F44336', // Red
      },
      actionButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
      },
      // Attendee row styles
      attendeeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      },
      attendee: {
        fontSize: 15,
        color: theme.textPrimary,
        flex: 1,
      },
      removeButton: {
        backgroundColor: '#F44336', // Red
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
      },
      removeButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 12,
      },
      // Modal styles
      modal: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        backgroundColor: theme.surface,
        padding: 24,
        borderRadius: 12,
        width: '100%',
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.textPrimary,
        marginBottom: 16,
      },
      modalText: {
        fontSize: 15,
        color: theme.textPrimary,
        marginBottom: 20,
      },
      modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
      },
      cancelButton: {
        backgroundColor: '#757575', // Gray
      },
      confirmButton: {
        backgroundColor: '#F44336', // Red
      },
      modalButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15,
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
      optionsIcon: {
        padding: 6,
        borderRadius: 20,
        backgroundColor: theme.cardBackground,
        borderWidth: 1,
        borderColor: theme.surface,
      },
      removeButton: {
        padding: 6,
      },
    });
