package com.islam.backend.websocket.services;

import com.islam.backend.domain.entities.ChatMessageEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChatMessageService {
    void saveMessage(ChatMessageEntity message);

    Optional<List<ChatMessageEntity>> getHistoryByJummahId(UUID jummahId);
}
