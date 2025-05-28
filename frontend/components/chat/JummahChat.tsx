import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Keyboard,
  Animated,
  Easing,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJummahChat } from '@/hook/useJummahChat';
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
  const { messages, setMessages, loadMore, hasMore, isConnected: contextConnected } = useChat();
  const [messageText, setMessageText] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const scrollOffsetY = useRef(0);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const animatedBottom = useRef(new Animated.Value(0)).current;

  const scrollToBottom = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Use the existing WebSocket connection just for sending messages
  // The connection is established by the AuthWithWebSocketHandler in the protected layout
  // The ChatContext already handles receiving messages
  const { send } = useJummahChat({
    visible,
    jummahId,
    username,
    token,
    onMessage: (newMsg) => {
      // We don't need to handle messages here as the ChatContext already does that
      if (isNearBottom) {
        requestAnimationFrame(() => scrollToBottom());
      }
    },
  });

  // Use the connection status from the ChatContext
  const isConnected = contextConnected;

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

  useEffect(() => {
    // Define the keyboard event type
    type KeyboardEvent = {
      endCoordinates: {
        height: number;
        screenX: number;
        screenY: number;
        width: number;
      };
    };

    const onShow = (e: KeyboardEvent) => {
      Animated.timing(animatedBottom, {
        toValue: e.endCoordinates.height,
        duration: 250,
        easing: Easing.out(Easing.poly(4)),
        useNativeDriver: false,
      }).start();
    };

    const onHide = () => {
      Animated.timing(animatedBottom, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.poly(4)),
        useNativeDriver: false,
      }).start();
    };

    const showSub = Keyboard.addListener('keyboardWillShow', onShow);
    const hideSub = Keyboard.addListener('keyboardWillHide', onHide);
    const showSubAndroid = Keyboard.addListener('keyboardDidShow', onShow);
    const hideSubAndroid = Keyboard.addListener('keyboardDidHide', onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
      showSubAndroid.remove();
      hideSubAndroid.remove();
    };
  }, []);

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

  return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ImageBackground
            source={theme.absurdityTexture}
            style={{ flex: 1 }}
            imageStyle={{ transform: [{ scale: 1.8 }] }}
            resizeMode="cover"
        >
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

          <Animated.View style={[styles.inputContainer, { marginBottom: animatedBottom }]}>
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
          </Animated.View>
        </ImageBackground>
      </SafeAreaView>
  );
}

/**
 * Generate styles based on the current theme
 * @param theme - The current theme
 * @returns StyleSheet object
 */
const getStyles = (theme: Theme) =>
    StyleSheet.create({
      safeArea: {
        flex: 1,
        backgroundColor: theme.background,
        width: '100%',
        height: '100%',
      },
      listContent: {
        marginLeft: 12,
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
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: theme.surface,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        backgroundColor: theme.background,
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
