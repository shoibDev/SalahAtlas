import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '@/types/chat';

export function useJummahChatConnection({
                                          visible,
                                          token,
                                          jummahId,
                                          username,
                                          onMessage,
                                        }: {
  visible: boolean;
  token: string;
  jummahId: string;
  username: string;
  onMessage: (msg: ChatMessage) => void;
}) {
  const clientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!visible || !token) return;

    const socket = new SockJS('http://192.168.0.35:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        setIsConnected(true);
        client.subscribe(`/topic/jummah/${jummahId}`, (msg) => {
          const parsed: ChatMessage = JSON.parse(msg.body);
          onMessage(parsed);
        });
        // client.publish({
        //   destination: `/app/jummah/${jummahId}`,
        //   body: JSON.stringify({ sender: username, type: 'JOIN' }),
        // });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      // if (clientRef.current?.connected) {
      //   clientRef.current.publish({
      //     destination: `/app/jummah/${jummahId}`,
      //     body: JSON.stringify({ sender: username, type: 'LEAVE' }),
      //   });
      // }
      client.deactivate();
      setIsConnected(false);
    };
  }, [visible, token, jummahId, username]);

  const send = (msg: string) => {
    if (clientRef.current?.connected) {
      const payload: ChatMessage = {
        sender: username,
        message: msg,
        type: 'CHAT',
      };
      clientRef.current.publish({
        destination: `/app/jummah/${jummahId}`,
        body: JSON.stringify(payload),
      });
    } else {
      console.warn('⚠️ Cannot send — STOMP is not connected');
    }
  };

  return { isConnected, send };
}
