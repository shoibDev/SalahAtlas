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
  UIManager, ImageBackground,
} from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJummahChatConnection } from '@/hook/useJummahChat';
import { ChatMessage } from '@/types/chat';
import { useChat } from '@/context/ChatContext';
import { useTheme } from '@/context/ThemeContext';

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
  const theme = useTheme();
  const styles = getStyles(theme);
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
          <Text style={[styles.sender, isSelf && styles.senderSelf]}>
            {isSelf ? 'You' : item.sender}:
          </Text>
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

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  return (
      <Modal
          isVisible={visible}
          style={styles.modal}
          backdropOpacity={0.6}
          useNativeDriver
          onBackdropPress={onClose}
          onBackButtonPress={onClose}
      >
        <SafeAreaView style={styles.safeArea}>
          <ImageBackground
              source={theme.blackThreadBackground}
              style={{ flex: 1 }}
              imageStyle={{ opacity: 1.06 }}
              resizeMode="cover"
          >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardContainer}
            >
              {/* 🟫 Solid Header */}
              <View style={styles.headerContainer}>
                <View style={styles.header}>
                  <Text style={styles.title}>Jummah Chat</Text>
                  <TouchableOpacity onPress={onClose}>
                    <Text style={styles.closeButton}>×</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 📨 Messages */}
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

              {/* 🔲 Solid Input Row */}
              <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={messageText}
                    onChangeText={setMessageText}
                    placeholder="Type a message..."
                    placeholderTextColor={theme.textSecondary}
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
          </ImageBackground>
        </SafeAreaView>
      </Modal>
  );
}
const getStyles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
      modal: {
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center',
      },
      safeArea: {
        flex: 1,
        backgroundColor: theme.background,
        width: '100%',
      },
      keyboardContainer: {
        flex: 1,
        padding: 16,
      },
      headerContainer: {
        width: '100%',
        backgroundColor: theme.cardBackground,
        paddingHorizontal: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: theme.surface,
      },
      title: {
        color: theme.textPrimary,
        fontSize: 18,
        fontWeight: '700',
      },
      closeButton: {
        fontSize: 26,
        color: theme.textPrimary,
      },
      listContent: {
        paddingBottom: 12,
      },
      messageLine: {
        flexDirection: 'row',
        marginBottom: 10,
        flexWrap: 'wrap',
      },
      sender: {
        color: theme.accent,
        fontWeight: '600',
        fontSize: 16,
      },
      senderSelf: {
        color: theme.buttonBackground,
      },
      message: {
        color: theme.textPrimary,
        fontSize: 16,
      },
      systemMessage: {
        fontStyle: 'italic',
        color: theme.textSecondary,
        marginLeft: 4,
        fontSize: 14,
      },
      inputContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: theme.cardBackground,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: theme.surface,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        marginBottom: 20,
      },
      inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingTop: 10,
      },
      input: {
        flex: 1,
        backgroundColor: theme.surface,
        color: theme.textPrimary,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        maxHeight: 120,
      },

      sendButton: {
        marginLeft: 8,
        backgroundColor: theme.accent,
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 20,
      },
      disabled: {
        backgroundColor: '#555',
      },
      sendText: {
        color: theme.buttonText,
        fontWeight: '600',
      },
      loadMoreButton: {
        marginVertical: 12,
        alignSelf: 'center',
        backgroundColor: theme.cardBackground,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: theme.accent,
      },
      loadMoreText: {
        color: theme.accent,
        fontWeight: '600',
        fontSize: 15,
        textAlign: 'center',
      },
    });
