import apiClient from "@/api/apiClient";
import { API_END_POINTS } from "@/constants/apiEndPoints";
import { ChatMessage } from "@/types/chat";

/**
 * Interface for the paginated chat history response
 */
export interface ChatHistoryResponse {
  content: ChatMessage[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * Get chat history for a specific Jummah
 * @param jummahId - The ID of the Jummah
 * @param page - The page number (0-based)
 * @param size - The number of messages per page
 * @returns Promise with the chat history response
 */
export const getChatHistory = async (
  jummahId: string,
  page: number = 0,
  size: number = 20
): Promise<ChatHistoryResponse> => {
  try {
    const endpoint = API_END_POINTS.GET_CHAT_HISTORY.replace(
      ":jummahId",
      jummahId
    );
    
    const response = await apiClient.get(endpoint, {
      params: { page, size },
    });
    
    return response.data.data;
  } catch (error) {
    console.error("Failed to load chat history:", error);
    throw error;
  }
};