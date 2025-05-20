import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface ChatMessage {
  sender: string;
  message: string;
}

interface Props {
  messages: ChatMessage[];
  onExpand: () => void;
}

export default function ChatPreview({ messages, onExpand }: Props) {
  const latestMessages = messages.slice(-15);

  return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onExpand} style={styles.header}>
          <Text style={styles.title}>Jummah Chat</Text>
          <Text style={styles.expandIcon}>⤢</Text>
        </TouchableOpacity>

        <ScrollView
            style={styles.messageList}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            onStartShouldSetResponderCapture={() => true}
        >
          {latestMessages.map((item, idx) => (
              <View key={idx} style={styles.messageLine}>
                <Text style={styles.sender}>{item.sender}:</Text>
                <Text style={styles.message}> {item.message}</Text>
              </View>
          ))}
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f2937',
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
    height: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#374151',
    paddingBottom: 8,
    marginBottom: 8,
  },
  title: {
    color: '#f9fafb',
    fontSize: 16,
    fontWeight: '600',
  },
  expandIcon: {
    fontSize: 18,
    color: '#10b981',
    fontWeight: '700',
  },
  messageList: {
    flex: 1,
  },
  messageLine: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  sender: {
    color: '#133383',
    fontWeight: '600',
  },
  message: {
    color: '#f3f4f6',
  },
});
