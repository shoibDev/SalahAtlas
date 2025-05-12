package com.islam.backend.domain.entities;

import com.islam.backend.enums.MessageType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class ChatMessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String sender;
    private String message;
    private MessageType type;
    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "jummah_id")
    private JummahEntity jummah;

}