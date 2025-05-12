package com.islam.backend.websocket.repositories;

import com.islam.backend.domain.entities.ChatMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {
    List<ChatMessageEntity> findAllByOrderByTimestampDesc();
    List<ChatMessageEntity> findByJummahIdOrderByTimestampDesc(UUID jummahId);
}
