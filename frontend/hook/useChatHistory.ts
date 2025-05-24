import { useEffect, useState, useCallback } from 'react';
import apiClient from '@/api/apiClient';
import { ChatMessage } from '@/types/chat';

export function useChatHistory(jummahId: string | undefined) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (!jummahId || !hasMore || loading) return;

    try {
      setLoading(true);
      const res = await apiClient.get(
          `/chat/jummah/${jummahId}/history/pageable?page=${page}&size=20`
      );

      const newMessages: ChatMessage[] = res.data.data.content;
      setMessages((prev) => [...prev, ...newMessages]); // Append at end (FlatList is inverted)
      setPage((prev) => prev + 1);
      setHasMore(!res.data.data.last); // Check if last page
    } catch (err) {
      console.error('Failed to load chat history:', err);
    } finally {
      setLoading(false);
    }
  }, [jummahId, page, hasMore, loading]);

  useEffect(() => {
    setMessages([]);
    setPage(0);
    setHasMore(true);
    if (jummahId) loadMore(); // Load first page
  }, [jummahId]);

  return {
    messages,
    setMessages,
    loadMore,
    hasMore,
  };
}
