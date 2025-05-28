import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { useChat } from '@/context/ChatContext';
import { useTheme } from '@/context/ThemeContext';

interface Props {
  onExpand: () => void;
}

export default function ChatPreview({ onExpand }: Props) {
  const { messages, isConnected } = useChat();
  const theme = useTheme();
  const styles = getStyles(theme);
  const latestMessages = messages.slice(0, 15);

  return (
      <ImageBackground
          source={theme.absurdityTexture}
          style={styles.container}
          imageStyle={{
            borderRadius: 16,
            opacity: 1.06,
            transform: [{ scale: 1.8 }],
          }}
      >
        <TouchableOpacity onPress={onExpand} style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Jummah Chat</Text>
            <View style={[styles.connectionIndicator, isConnected ? styles.connected : styles.disconnected]} />
          </View>
          <Text style={styles.expandIcon}>⤢</Text>
        </TouchableOpacity>

        <ScrollView
            style={styles.messageList}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            onStartShouldSetResponderCapture={() => true}
        >
          {latestMessages.length === 0 ? (
              <Text style={styles.noMessages}>No messages yet. Be the first to say Salaam 👋</Text>
          ) : (
              latestMessages
                  .slice()
                  .reverse()
                  .map((item, idx) => (
                      <View key={idx} style={styles.messageLine}>
                        <Text style={styles.sender}>{item.sender}:</Text>
                        <Text style={styles.message}> {item.message}</Text>
                      </View>
                  ))
          )}
        </ScrollView>
      </ImageBackground>
  );
}

const getStyles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
      container: {
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 14,
        marginTop: 20,
        height: 300,
        overflow: 'hidden',
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: theme.surface,
        paddingBottom: 6,
        marginBottom: 8,
      },
      titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      title: {
        color: theme.textPrimary,
        fontSize: 16,
        fontWeight: '700',
        marginRight: 8,
      },
      connectionIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 1,
      },
      connected: {
        backgroundColor: '#4CAF50', // Green
      },
      disconnected: {
        backgroundColor: '#F44336', // Red
      },
      expandIcon: {
        fontSize: 18,
        color: theme.accent,
        fontWeight: '700',
      },
      messageList: {
        flex: 1,
      },
      messageLine: {
        flexDirection: 'row',
        marginBottom: 6,
        flexWrap: 'wrap',
      },
      sender: {
        color: theme.accent,
        fontWeight: '600',
      },
      message: {
        color: theme.textPrimary,
      },
      noMessages: {
        fontStyle: 'italic',
        color: theme.textSecondary,
        marginTop: 10,
      },
    });
