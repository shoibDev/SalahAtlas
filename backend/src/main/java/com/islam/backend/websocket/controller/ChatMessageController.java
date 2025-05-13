package com.islam.backend.websocket.controller;

import com.islam.backend.domain.dto.chatmessage.request.ChatMessageRequest;
import com.islam.backend.domain.entities.ChatMessageEntity;
import com.islam.backend.mapper.ChatMessageMapper;
import com.islam.backend.websocket.services.ChatMessageService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
public class ChatMessageController {

    private final ChatMessageService chatMessageService;
    private final ChatMessageMapper chatMessageMapper;

    public ChatMessageController(ChatMessageService chatMessageService, ChatMessageMapper chatMessageMapper) {
        this.chatMessageService = chatMessageService;
        this.chatMessageMapper = chatMessageMapper;
    }

    @GetMapping("/jummah/{jummahId}/history")
    public List<ChatMessageRequest> getHistory(@PathVariable UUID jummahId) {
        List<ChatMessageEntity> entities = chatMessageService.getHistoryByJummahId(jummahId).orElse(null);
        if (entities == null) {
            return null;
        }
        return entities.stream()
                .map(chatMessageMapper::toChatMessageResponse)
                .collect(Collectors.toList());
    }

}
