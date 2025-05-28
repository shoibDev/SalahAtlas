// app/protected/chat/[jummahId].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import JummahChat from '@/components/chat/JummahChat';
import { ChatProvider } from '@/context/ChatContext';
import { useAuth } from '@/context/authContext';

export default function JummahChatScreen() {
  const { jummahId } = useLocalSearchParams();
  const router = useRouter();
  const { token } = useAuth(); // Assuming your authContext provides both

  if (!token || !jummahId || typeof jummahId !== 'string') {
    return null; // Or show a loading / error screen
  }


  return (
      <ChatProvider jummahId={jummahId}>

        <JummahChat
            visible={true}
            onClose={() => router.back()}
            username={ 'User'}
            token={token}
            jummahId={jummahId}
        />
      </ChatProvider>
  );
}
