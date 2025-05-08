package com.islam.backend.domain.dto;

import com.islam.backend.enums.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageDto {
    private UUID id;
    private String sender;
    private String content;
    private long timestamp;
    private UUID roomId;
    private String type;
}