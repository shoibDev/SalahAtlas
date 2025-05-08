package com.islam.backend.websocket.handler;

import com.islam.backend.websocket.domain.Message;
import com.islam.backend.websocket.services.MessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.UUID;

@Component
public class MessageHandler {

    private static final Logger logger = LoggerFactory.getLogger(MessageHandler.class);

    private final SimpMessageSendingOperations messagingTemplate;
    private final MessageService messageService;

    public MessageHandler(SimpMessageSendingOperations messagingTemplate, MessageService messageService) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
    }

    /**
     * Event listener for WebSocket connection established
     */
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        logger.info("Received a new web socket connection: {}", event.getMessage());
    }

    /**
     * Event listener for WebSocket connection closed
     */
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        logger.info("User disconnected: {}", event.getSessionId());

        // Get session attributes
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        UUID roomId = (UUID) headerAccessor.getSessionAttributes().get("roomId");

        if (username != null && roomId != null) {
            logger.info("User {} disconnected from room {}", username, roomId);

            // Send leave notification
            sendLeaveNotification(roomId, username);
        }
    }

    public void sendSystemNotification(UUID roomId, String messageText) {
        if (roomId == null || messageText == null || messageText.trim().isEmpty()) {
            throw new IllegalArgumentException("Room ID and message text must not be null or empty");
        }

        Message message = new Message();
        message.setRoomID(roomId);
        message.setMessage(messageText);
        message.setTimestamp(System.currentTimeMillis());
        message.setSender("System");
        message.setType(Message.MessageType.SYSTEM);

        messagingTemplate.convertAndSend("/room/" + roomId + "/messages", message);
    }

    public void sendJoinNotification(UUID roomId, String username) {
        if (roomId == null || username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Room ID and username must not be null or empty");
        }

        Message message = new Message();
        message.setRoomID(roomId);
        message.setMessage(username + " joined the room");
        message.setTimestamp(System.currentTimeMillis());
        message.setSender(username);
        message.setType(Message.MessageType.JOIN);

        messagingTemplate.convertAndSend("/room/" + roomId + "/messages", message);
    }


    public void sendLeaveNotification(UUID roomId, String username) {
        if (roomId == null || username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Room ID and username must not be null or empty");
        }

        Message message = new Message();
        message.setRoomID(roomId);
        message.setMessage(username + " left the room");
        message.setTimestamp(System.currentTimeMillis());
        message.setSender(username);
        message.setType(Message.MessageType.LEAVE);

        messagingTemplate.convertAndSend("/room/" + roomId + "/messages", message);
    }
}
