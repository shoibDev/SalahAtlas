package com.islam.backend.websocket.controller;

import com.islam.backend.domain.dto.ChatMessageDto;
import com.islam.backend.domain.entities.ChatMessageEntity;
import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.mapper.ChatMessageMapper;
import com.islam.backend.repositories.JummahRepository;
import com.islam.backend.services.JummahService;
import com.islam.backend.websocket.services.ChatMessageService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.UUID;

@Controller
public class WebSocketController {

    private final ChatMessageService chatMessageService;
    private final JummahService jummahService;
    private final JummahRepository jummahRepository;
    private final ChatMessageMapper chatMessageMapper;

    public WebSocketController(
            ChatMessageService chatMessageService,
            JummahService jummahService,
            JummahRepository jummahRepository,
            ChatMessageMapper chatMessageMapper
    ) {
        this.chatMessageService = chatMessageService;
        this.jummahService = jummahService;
        this.jummahRepository = jummahRepository;
        this.chatMessageMapper = chatMessageMapper;
    }

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public ChatMessageDto sendMessage(ChatMessageDto messageDto) {
        messageDto.setTimestamp(LocalDateTime.now());
        ChatMessageEntity entity = chatMessageMapper.mapFrom(messageDto);
        chatMessageService.saveMessage(entity);
        return chatMessageMapper.mapTo(entity);
    }

    @MessageMapping("/jummah/{jummahId}")
    @SendTo("/topic/jummah/{jummahId}")
    public ChatMessageDto sendRoomMessage(@DestinationVariable UUID jummahId, ChatMessageDto messageDto) {
        JummahEntity jummahEntity = jummahRepository.findById(jummahId).orElseThrow(() -> new IllegalArgumentException("Invalid jummah id"));
        messageDto.setJummahId(jummahId);
        messageDto.setTimestamp(LocalDateTime.now());
        ChatMessageEntity entity = chatMessageMapper.mapFrom(messageDto);
        entity.setJummah(jummahEntity);
        chatMessageService.saveMessage(entity);
        return chatMessageMapper.mapTo(entity);
    }
}
