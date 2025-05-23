import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  LayoutAnimation,
    UIManager,

} from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJummahChatConnection } from '@/hook/useJummahChat';
import { ChatMessage } from '@/types/chat';
import { useChat } from '@/context/ChatContext';

interface Props {
  visible: boolean;
  onClose: () => void;
  username: string;
  token: string;
  jummahId: string;
}

export default function JummahChat({
                                     visible,
                                     onClose,
                                     username,
                                     token,
                                     jummahId,
                                   }: Props) {
  const { messages, setMessages, loadMore, hasMore } = useChat();
  const [messageText, setMessageText] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const scrollOffsetY = useRef(0);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const scrollToBottom = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const { isConnected, send } = useJummahChatConnection({
    visible,
    jummahId,
    username,
    token,
    onMessage: (newMsg) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages((prev) => [newMsg, ...prev]);
      if (isNearBottom) {
        requestAnimationFrame(() => scrollToBottom());
      }
    },
  });

  const handleSend = () => {
    const trimmed = messageText.trim();
    if (!trimmed) return;
    send(trimmed);
    setMessageText('');
    requestAnimationFrame(() => scrollToBottom());
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await loadMore();
    setLoadingMore(false);
  };

  const renderSystemMessage = (text: string) => (
      <Text style={styles.systemMessage}>{text}</Text>
  );

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isSelf = item.sender === username;
    return (
        <View style={styles.messageLine}>
          <Text style={styles.sender}>{isSelf ? 'You' : item.sender}:</Text>
          {item.type === 'CHAT' && <Text style={styles.message}> {item.message}</Text>}
          {item.type === 'JOIN' && renderSystemMessage('joined the chat')}
          {item.type === 'LEAVE' && renderSystemMessage('left the chat')}
        </View>
    );
  };

  const renderLoadMoreButton = () =>
      hasMore ? (
          <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={handleLoadMore}
              activeOpacity={0.8}
          >
            <Text style={styles.loadMoreText}>
              {loadingMore ? 'Loading more...' : 'Load earlier messages'}
            </Text>
          </TouchableOpacity>
      ) : null;

  if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  return (
      <Modal
          isVisible={visible}
          style={styles.modal}
          backdropOpacity={0.6}
          useNativeDriver={true}
          onBackdropPress={onClose}
          onBackButtonPress={onClose}
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardContainer}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Jummah Chat</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>

            <FlatList
                ref={listRef}
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                inverted
                ListFooterComponent={renderLoadMoreButton}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
                onScroll={({ nativeEvent }) => {
                  const y = nativeEvent.contentOffset.y;
                  scrollOffsetY.current = y;
                  setIsNearBottom(y < 50);
                }}
                scrollEventThrottle={16}
            />

            <View style={styles.inputRow}>
              <TextInput
                  style={styles.input}
                  value={messageText}
                  onChangeText={setMessageText}
                  placeholder="Message..."
                  placeholderTextColor="#9ca3af"
                  multiline
              />
              <TouchableOpacity
                  style={[styles.sendButton, !isConnected && styles.disabled]}
                  onPress={handleSend}
                  disabled={!isConnected}
              >
                <Text style={styles.sendText}>{isConnected ? 'Send' : '...'}</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#111827',
    width: '100%',
  },
  keyboardContainer: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#374151',
    marginBottom: 12,
  },
  title: {
    color: '#f9fafb',
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    fontSize: 26,
    color: '#f9fafb',
  },
  listContent: {
    paddingBottom: 12,
  },
  messageLine: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  sender: {
    color: '#10b981',
    fontWeight: '600',
    fontSize: 16,
  },
  message: {
    color: '#f3f4f6',
    fontSize: 16,
  },
  systemMessage: {
    fontStyle: 'italic',
    color: '#9ca3af',
    marginLeft: 4,
    fontSize: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#1f2937',
    color: '#f9fafb',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 120,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  disabled: {
    backgroundColor: '#555',
  },
  sendText: {
    color: '#f9fafb',
    fontWeight: '600',
  },
  loadMoreButton: {
    marginVertical: 12,
    alignSelf: 'center',
    backgroundColor: '#1f2937',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#10b981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },

  loadMoreText: {
    color: '#10b981',
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'center',
  },
});
