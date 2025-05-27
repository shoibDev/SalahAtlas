package com.islam.backend.websocket.controller;

import com.islam.backend.domain.dto.chatmessage.request.ChatMessageRequest;
import com.islam.backend.domain.dto.response.ApiResponse;
import com.islam.backend.domain.entities.ChatMessageEntity;
import com.islam.backend.mapper.ChatMessageMapper;
import com.islam.backend.websocket.services.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Controller for chat message operations.
 * Provides endpoints for retrieving chat history.
 */
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatMessageController {

    private final ChatMessageService chatMessageService;
    private final ChatMessageMapper chatMessageMapper;

    /**
     * Get chat message history for a specific Jummah event.
     *
     * @param jummahId The Jummah ID
     * @return List of chat messages
     */
    @GetMapping("/jummah/{jummahId}/history")
    public ResponseEntity<ApiResponse<List<ChatMessageRequest>>> getHistory(@PathVariable UUID jummahId) {
        List<ChatMessageEntity> entities = chatMessageService.getHistoryByJummahId(jummahId).orElse(Collections.emptyList());

        List<ChatMessageRequest> messages = entities.stream()
                .map(chatMessageMapper::toChatMessageResponse)
                .collect(Collectors.toList());

        String message = messages.isEmpty() 
            ? "No chat history found for this Jummah" 
            : "Retrieved " + messages.size() + " messages";

        return ResponseEntity.ok(ApiResponse.success(messages, message));
    }

    /**
     * Get paginated chat message history for a specific Jummah event.
     *
     * @param jummahId The Jummah ID
     * @param page The page number (0-based)
     * @param size The page size
     * @return Page of chat messages
     */
    @GetMapping("/jummah/{jummahId}/history/pageable")
    public ResponseEntity<ApiResponse<Page<ChatMessageRequest>>> getHistoryPageable(
            @PathVariable UUID jummahId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ChatMessageEntity> entitiesPage = chatMessageService.getHistoryByJummahIdPageable(jummahId, pageable);

        Page<ChatMessageRequest> messagesPage = entitiesPage.map(chatMessageMapper::toChatMessageResponse);

        String message = messagesPage.isEmpty() 
            ? "No chat history found for this Jummah" 
            : "Retrieved page " + page + " with " + messagesPage.getNumberOfElements() + " messages (total: " + messagesPage.getTotalElements() + ")";

        return ResponseEntity.ok(ApiResponse.success(messagesPage, message));
    }
}
