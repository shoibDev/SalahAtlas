package com.islam.backend.repositories;

import com.islam.backend.domain.entities.MessageEntity;
import com.islam.backend.domain.entities.JummahEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for MessageEntity
 */
@Repository
public interface MessageRepository extends JpaRepository<MessageEntity, UUID> {
    /**
     * Find all messages for a specific room
     * 
     * @param room The room entity
     * @return List of messages in the room
     */
    List<MessageEntity> findByRoom(JummahEntity room);
    
    /**
     * Find all messages for a specific room ID
     * 
     * @param roomId The room ID
     * @return List of messages in the room
     */
    List<MessageEntity> findByRoomId(UUID roomId);
}