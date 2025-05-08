package com.islam.backend.websocket.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    private UUID roomID;
    private String message;
    private long timestamp;
    private String sender;
    private MessageType type = MessageType.CHAT;


    public enum MessageType {
        CHAT,           // Regular chat message
        JOIN,           // User joined notification
        LEAVE,          // User left notification
        SYSTEM          // System notification
    }
}
