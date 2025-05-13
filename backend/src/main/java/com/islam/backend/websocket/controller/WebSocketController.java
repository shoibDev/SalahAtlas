package com.islam.backend.websocket.controller;

import com.islam.backend.domain.dto.chatmessage.request.ChatMessageRequest;
import com.islam.backend.domain.entities.ChatMessageEntity;
import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.exceptions.ResourceNotFoundException;
import com.islam.backend.mapper.ChatMessageMapper;
import com.islam.backend.repositories.JummahRepository;
import com.islam.backend.websocket.services.ChatMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Controller for WebSocket communication.
 * Handles real-time chat messages for global and Jummah-specific channels.
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {

    private final ChatMessageService chatMessageService;
    private final JummahRepository jummahRepository;
    private final ChatMessageMapper chatMessageMapper;
    private final SimpMessageSendingOperations messagingTemplate;

    /**
     * Handle messages sent to the global chat channel.
     *
     * @param messageDto The chat message
     * @return The processed chat message
     */
    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public ChatMessageRequest sendMessage(ChatMessageRequest messageDto) {
        log.info("Received message for global chat from user: {}", messageDto.getSender());

        // Set current timestamp
        messageDto.setTimestamp(LocalDateTime.now());

        // Save the message
        ChatMessageEntity entity = chatMessageMapper.toEntity(messageDto);
        chatMessageService.saveMessage(entity);

        // Return the processed message
        return chatMessageMapper.toChatMessageResponse(entity);
    }

    /**
     * Handle messages sent to a specific Jummah chat channel.
     *
     * @param jummahId The ID of the Jummah
     * @param messageDto The chat message
     * @return The processed chat message
     * @throws ResourceNotFoundException if the Jummah doesn't exist
     */
    @MessageMapping("/jummah/{jummahId}")
    @SendTo("/topic/jummah/{jummahId}")
    public ChatMessageRequest sendRoomMessage(@DestinationVariable UUID jummahId, ChatMessageRequest messageDto) {
        log.info("Received message for Jummah {} from user: {}", jummahId, messageDto.getSender());

        // Verify the Jummah exists
        JummahEntity jummahEntity = jummahRepository.findById(jummahId)
                .orElseThrow(() -> new ResourceNotFoundException("Jummah", jummahId));

        // Set message metadata
        messageDto.setJummahId(jummahId);
        messageDto.setTimestamp(LocalDateTime.now());

        // Save the message
        ChatMessageEntity entity = chatMessageMapper.toEntity(messageDto);
        entity.setJummah(jummahEntity);
        chatMessageService.saveMessage(entity);

        // Return the processed message
        return chatMessageMapper.toChatMessageResponse(entity);
    }
}
