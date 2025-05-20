import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ChatMessage {
  sender: string;
  message: string;
  type: 'CHAT';
}

interface Props {
  visible: boolean;
  onClose: () => void;
  jummahId: string;
  username: string;
  token: string;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function JummahChat({
                                     visible,
                                     onClose,
                                     jummahId,
                                     username,
                                     token,
                                     messages,
                                     setMessages,
                                   }: Props) {
  const [messageText, setMessageText] = useState('');
  const [isAtBottom, setIsAtBottom] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const sendMessage = () => {
    if (!messageText.trim()) return;
    const msg: ChatMessage = {
      sender: username,
      message: messageText.trim(),
      type: 'CHAT',
    };
    setMessages(prev => [...prev, msg]);
    setMessageText('');

    // Force scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderItem = ({ item }: { item: ChatMessage }) => (
      <View style={styles.messageWrapper}>
        <Text style={styles.sender}>{item.sender}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const threshold = 20;
    const atBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - threshold;
    setIsAtBottom(atBottom);
  };

  return (
      <Modal
          isVisible={visible}
          backdropColor="#000"
          backdropOpacity={0.6}
          animationIn="fadeIn"
          animationOut="fadeOut"
          backdropTransitionOutTiming={0}
          useNativeDriver
          style={styles.modal}
      >
        <Animated.View
            style={[styles.animatedContainer, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}
        >
          <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
                style={styles.container}
            >
              <View style={styles.innerContainer}>
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Jummah Chat</Text>
                  <TouchableOpacity onPress={onClose}>
                    <Text style={styles.closeButton}>×</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(_, idx) => idx.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.chatBox}
                    onContentSizeChange={() => {
                      if (isAtBottom) {
                        flatListRef.current?.scrollToEnd({ animated: true });
                      }
                    }}
                    onScroll={handleScroll}
                    scrollEventThrottle={100}
                />

                <View style={styles.inputWrapper}>
                  <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Message..."
                        placeholderTextColor="#9ca3af"
                        value={messageText}
                        onChangeText={setMessageText}
                        style={styles.input}
                        multiline
                        textAlignVertical="top"
                        blurOnSubmit={false}
                        onSubmitEditing={() => {}}
                    />
                    <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                      <Text style={styles.sendText}>Send</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Animated.View>
      </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  animatedContainer: {
    width: '92%',
    height: '85%',
    backgroundColor: '#111827',
    borderRadius: 14,
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#111827',
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: '#1f2937',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    height: 64,
    borderBottomWidth: 1,
    borderColor: '#374151',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f9fafb',
  },
  closeButton: {
    fontSize: 24,
    color: '#f9fafb',
    paddingHorizontal: 8,
  },
  chatBox: {
    padding: 16,
    flexGrow: 1,
  },
  messageWrapper: {
    marginBottom: 14,
  },
  sender: {
    fontSize: 14,
    fontWeight: '600',
    color: '#133383',
  },
  message: {
    fontSize: 15,
    color: '#f3f4f6',
    marginTop: 2,
  },
  inputWrapper: {
    backgroundColor: '#1f2937',
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#374151',
  },
  input: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    color: '#f9fafb',
    fontSize: 15,
    maxHeight: 120,
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: '#133383',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  sendText: {
    color: '#f9fafb',
    fontWeight: '600',
  },
});
