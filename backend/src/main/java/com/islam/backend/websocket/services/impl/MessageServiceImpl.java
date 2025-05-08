package com.islam.backend.websocket.services.impl;

import com.islam.backend.domain.dto.MessageDto;
import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.domain.entities.MessageEntity;
import com.islam.backend.enums.MessageType;
import com.islam.backend.mapper.impl.MessageMapperImpl;
import com.islam.backend.repositories.JummahRepository;
import com.islam.backend.repositories.MessageRepository;
import com.islam.backend.websocket.domain.Message;
import com.islam.backend.websocket.services.MessageService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
public class MessageServiceImpl implements MessageService {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageRepository messageRepository;
    private final JummahRepository jummahRepository;
    private final MessageMapperImpl messageMapper;

    public MessageServiceImpl(SimpMessagingTemplate messagingTemplate, 
                             MessageRepository messageRepository,
                             JummahRepository jummahRepository,
                             MessageMapperImpl messageMapper) {
        this.messagingTemplate = messagingTemplate;
        this.messageRepository = messageRepository;
        this.jummahRepository = jummahRepository;
        this.messageMapper = messageMapper;
    }

    @Override
    public Message processMessage(Message message) {
        if (message == null) {
            throw new IllegalArgumentException("Message cannot be null");
        }

        // Set timestamp if not already set
        if (message.getTimestamp() == 0) {
            message.setTimestamp(System.currentTimeMillis());
        }

        // Validate sender
        if (message.getSender() == null || message.getSender().trim().isEmpty()) {
            message.setSender("Anonymous");
        }

        // Set default message type if not set
        if (message.getType() == null) {
            message.setType(Message.MessageType.CHAT);
        }

        // Convert Message to MessageEntity and save it
        MessageEntity messageEntity = new MessageEntity();
        messageEntity.setSender(message.getSender());
        messageEntity.setContent(message.getMessage());
        messageEntity.setTimestamp(message.getTimestamp());

        // Convert Message.MessageType to MessageType enum
        MessageType messageType;
        try {
            messageType = MessageType.valueOf(message.getType().name());
        } catch (Exception e) {
            messageType = MessageType.CHAT;
        }
        messageEntity.setType(messageType);

        // Set the room
        jummahRepository.findById(message.getRoomID())
                .ifPresent(messageEntity::setRoom);

        // Save the message
        messageRepository.save(messageEntity);

        return message;
    }

    @Override
    public List<Message> getMessagesByRoomId(UUID roomId) {
        if (roomId == null) {
            throw new IllegalArgumentException("Room ID cannot be null");
        }

        // Get messages from repository
        List<MessageEntity> messageEntities = messageRepository.findByRoomId(roomId);

        // Convert MessageEntity list to Message list
        return messageEntities.stream()
                .map(this::convertToMessage)
                .collect(Collectors.toList());
    }

    private Message convertToMessage(MessageEntity messageEntity) {
        Message message = new Message();
        message.setRoomID(messageEntity.getRoom().getId());
        message.setMessage(messageEntity.getContent());
        message.setTimestamp(messageEntity.getTimestamp());
        message.setSender(messageEntity.getSender());

        // Convert MessageType enum to Message.MessageType
        Message.MessageType messageType;
        try {
            messageType = Message.MessageType.valueOf(messageEntity.getType().name());
        } catch (Exception e) {
            messageType = Message.MessageType.CHAT;
        }
        message.setType(messageType);

        return message;
    }

    @Override
    public void sendMessage(UUID roomId, Message message) {
        if (roomId == null || message == null) {
            throw new IllegalArgumentException("Room ID and message cannot be null");
        }

        // Process and store the message
        Message processedMessage = processMessage(message);

        // Send the message to the specific room
        messagingTemplate.convertAndSend("/room/" + roomId + "/messages", processedMessage);
    }
}
