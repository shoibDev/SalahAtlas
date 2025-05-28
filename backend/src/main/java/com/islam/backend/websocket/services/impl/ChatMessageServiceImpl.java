package com.islam.backend.websocket.services.impl;

import com.islam.backend.domain.entities.ChatMessageEntity;
import com.islam.backend.repositories.JummahRepository;
import com.islam.backend.websocket.repositories.ChatMessageRepository;
import com.islam.backend.websocket.services.ChatMessageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;

    public ChatMessageServiceImpl(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    @Override
    public void saveMessage(ChatMessageEntity message) {
        chatMessageRepository.save(message);
    }

    @Override
    public Optional<List<ChatMessageEntity>> getHistoryByJummahId(UUID jummahId) {
        return Optional.of(chatMessageRepository.findByJummahIdOrderByTimestampDesc(jummahId));
    }

    @Override
    public Page<ChatMessageEntity> getHistoryByJummahIdPageable(UUID jummahId, Pageable pageable) {
        return chatMessageRepository.findByJummahIdOrderByTimestampDesc(jummahId, pageable);
    }
}
