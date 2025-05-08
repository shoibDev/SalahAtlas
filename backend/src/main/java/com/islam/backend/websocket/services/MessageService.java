package com.islam.backend.websocket.services;

import com.islam.backend.websocket.domain.Message;

import java.util.List;
import java.util.UUID;


public interface MessageService {

    Message processMessage(Message message);

    List<Message> getMessagesByRoomId(UUID roomId);

    void sendMessage(UUID roomId, Message message);
}