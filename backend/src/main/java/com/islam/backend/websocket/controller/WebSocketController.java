package com.islam.backend.websocket.controller;

import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.repositories.JummahRepository;
import com.islam.backend.websocket.domain.Message;
import com.islam.backend.websocket.handler.MessageHandler;
import com.islam.backend.websocket.services.MessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Controller for handling WebSocket messages
 */
@Controller
public class WebSocketController {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketController.class);  // Add the logger

    private final MessageService messageService;
    private final MessageHandler messageHandler;
    private final JummahRepository jummahRepository;

    public WebSocketController(MessageService messageService, MessageHandler messageHandler, JummahRepository jummahRepository) {
        this.messageService = messageService;
        this.messageHandler = messageHandler;
        this.jummahRepository = jummahRepository;
    }

    @MessageMapping("/chat/{roomId}")
    @SendTo("/room/{roomId}/messages")
    public Message processChatMessage(
            @DestinationVariable UUID roomId,
            @Payload Message message,
            SimpMessageHeaderAccessor headerAccessor) {

        if (roomId == null || message == null) {
            logger.error("Room ID or message is null. Unable to process.");
            throw new IllegalArgumentException("Room ID and message must not be null");
        }

        logger.debug("Processing chat message for room: {}", roomId);

        // Ensure the message has the correct room ID
        message.setRoomID(roomId);
        logger.debug("Message for room ID: {}: {}", roomId, message);

        // Store username in WebSocket session for tracking join/leave
        String username = message.getSender();
        if (username != null && headerAccessor != null) {
            headerAccessor.getSessionAttributes().put("username", username);
            headerAccessor.getSessionAttributes().put("roomId", roomId);

            logger.debug("User {} joined room {}", username, roomId);

            // Track the room - check if it exists in the database, if not create it
            if (!jummahRepository.existsById(roomId)) {
                JummahEntity jummahEntity = new JummahEntity();
                jummahEntity.setId(roomId);
                jummahRepository.save(jummahEntity);
                logger.debug("Created new room with ID: {}", roomId);
            }

            // If this is a JOIN message, send a notification
            if (message.getType() == Message.MessageType.JOIN) {
                logger.info("User {} joined the room {}", username, roomId);
                messageHandler.sendJoinNotification(roomId, username);
                return null; // Don't send the original message
            }
        }

        // Process the message
        logger.debug("Message processed: {}", message);
        return messageService.processMessage(message);
    }

    @MessageMapping("/chat/{roomId}/history")
    @SendTo("/room/{roomId}/history")
    public List<Message> getRoomHistory(@DestinationVariable UUID roomId) {
        if (roomId == null) {
            logger.error("Room ID is null. Unable to fetch room history.");
            throw new IllegalArgumentException("Room ID must not be null");
        }

        logger.debug("Fetching history for room {}", roomId);
        List<Message> history = messageService.getMessagesByRoomId(roomId);
        logger.debug("Fetched {} messages for room {}", history.size(), roomId);
        return history;
    }

    @GetMapping("/api/chat/rooms")
    @ResponseBody
    public Set<UUID> getActiveRooms() {
        // Get all rooms from the database
        Set<UUID> activeRooms = jummahRepository.findAll().stream()
                .map(JummahEntity::getId)
                .collect(Collectors.toSet());
        logger.debug("Active rooms fetched: {}", activeRooms);
        return activeRooms;
    }

    @GetMapping("/api/chat/rooms/{roomId}")
    @ResponseBody
    public Map<String, Object> getRoomDetails(@PathVariable UUID roomId) {
        // Get room from the database
        Optional<JummahEntity> jummahOpt = jummahRepository.findById(roomId);
        if (jummahOpt.isEmpty()) {
            logger.error("Room with ID {} not found", roomId);
            throw new IllegalArgumentException("Room not found");
        }

        JummahEntity jummah = jummahOpt.get();
        logger.debug("Room details fetched for ID {}: {}", roomId, jummah);

        return Map.of(
                "id", roomId,
                "name", "Chat Room " + roomId,
                "messageCount", messageService.getMessagesByRoomId(roomId).size()
        );
    }
}
