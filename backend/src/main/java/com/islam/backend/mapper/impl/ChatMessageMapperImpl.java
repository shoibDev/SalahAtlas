package com.islam.backend.mapper.impl;

import com.islam.backend.domain.dto.chatmessage.request.ChatMessageRequest;
import com.islam.backend.domain.entities.ChatMessageEntity;
import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.mapper.ChatMessageMapper;
import com.islam.backend.repositories.JummahRepository;
import com.islam.backend.services.jummah.JummahService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@AllArgsConstructor
public class ChatMessageMapperImpl implements ChatMessageMapper {

    private final JummahService jummahService;

    @Override
    public ChatMessageEntity toEntity(ChatMessageRequest request) {
        if (request == null) return null;

        JummahEntity jummah = null;
        if (request.getJummahId() != null) {
            jummah = jummahService.findById(request.getJummahId());
        }

        return ChatMessageEntity.builder()
                .message(request.getMessage())
                .sender(request.getSender())
                .timestamp(request.getTimestamp())
                .type(request.getType())
                .jummah(jummah)
                .build();
    }

    @Override
    public ChatMessageRequest toChatMessageResponse(ChatMessageEntity entity) {
        if (entity == null) return null;

        return ChatMessageRequest.builder()
                .message(entity.getMessage())
                .sender(entity.getSender())
                .timestamp(entity.getTimestamp())
                .type(entity.getType())
                .jummahId(
                        Optional.ofNullable(entity.getJummah())
                                .map(JummahEntity::getId)
                                .orElse(null)
                )

                .build();
    }
}
