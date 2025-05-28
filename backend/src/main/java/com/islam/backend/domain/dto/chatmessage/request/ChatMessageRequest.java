package com.islam.backend.domain.dto.chatmessage.request;

import com.islam.backend.enums.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessageRequest {
    private Long id;
    private String sender;
    private String message;
    private MessageType type;
    private LocalDateTime timestamp;
    private UUID jummahId;
}