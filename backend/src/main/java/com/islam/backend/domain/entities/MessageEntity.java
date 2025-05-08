package com.islam.backend.domain.entities;

import com.islam.backend.enums.MessageType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "messages")
public class MessageEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String sender;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private long timestamp;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private JummahEntity room;

    @Enumerated(EnumType.STRING)
    private MessageType type = MessageType.CHAT;

}
