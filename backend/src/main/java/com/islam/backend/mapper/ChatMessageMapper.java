package com.islam.backend.mapper;

import com.islam.backend.domain.dto.chatmessage.request.ChatMessageRequest;
import com.islam.backend.domain.entities.ChatMessageEntity;

public interface ChatMessageMapper {

    ChatMessageEntity toEntity(ChatMessageRequest chatMessageRequest);

    ChatMessageRequest toChatMessageResponse(ChatMessageEntity chatMessageEntity);

}