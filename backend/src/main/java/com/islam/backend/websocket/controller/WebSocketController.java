package com.islam.backend.websocket.controller;

import com.islam.backend.domain.dto.chatmessage.request.ChatMessageRequest;
import com.islam.backend.domain.entities.ChatMessageEntity;
import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.mapper.ChatMessageMapper;
import com.islam.backend.repositories.JummahRepository;
import com.islam.backend.websocket.services.ChatMessageService;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.UUID;

@Controller
@AllArgsConstructor
public class WebSocketController {

    private final ChatMessageService chatMessageService;
    private final JummahRepository jummahRepository;
    private final ChatMessageMapper chatMessageMapper;


    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public ChatMessageRequest sendMessage(ChatMessageRequest messageDto) {
        messageDto.setTimestamp(LocalDateTime.now());
        ChatMessageEntity entity = chatMessageMapper.toEntity(messageDto);
        chatMessageService.saveMessage(entity);
        return chatMessageMapper.toChatMessageResponse(entity);
    }

    @MessageMapping("/jummah/{jummahId}")
    @SendTo("/topic/jummah/{jummahId}")
    public ChatMessageRequest sendRoomMessage(@DestinationVariable UUID jummahId, ChatMessageRequest messageDto) {
        JummahEntity jummahEntity = jummahRepository.findById(jummahId).orElseThrow(() -> new IllegalArgumentException("Invalid jummah id"));
        messageDto.setJummahId(jummahId);
        messageDto.setTimestamp(LocalDateTime.now());
        ChatMessageEntity entity = chatMessageMapper.toEntity(messageDto);
        entity.setJummah(jummahEntity);
        chatMessageService.saveMessage(entity);
        return chatMessageMapper.toChatMessageResponse(entity);
    }
}
