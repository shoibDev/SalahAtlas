import { useEffect, useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import { getChatHistory } from '@/api/chatApi';

/**
 * Hook for managing chat history with pagination
 * @param jummahId - The ID of the Jummah chat
 * @returns Object containing messages, setMessages, loadMore, hasMore, and loading state
 */
export function useChatHistory(jummahId: string | undefined) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (!jummahId || !hasMore || loading) return;

    try {
      setLoading(true);
      const response = await getChatHistory(jummahId, page);

      const newMessages: ChatMessage[] = response.content;
      setMessages((prev) => [...prev, ...newMessages]); // Append at end (FlatList is inverted)
      setPage((prev) => prev + 1);
      setHasMore(!response.last); // Check if last page
    } catch (err) {
      console.error('Failed to load chat history:', err);
      // Don't rethrow the error to prevent UI disruption
    } finally {
      setLoading(false);
    }
  }, [jummahId, page, hasMore, loading]);

  // Reset and load first page when jummahId changes
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
    loading,
  };
}
