package com.islam.backend.mapper.impl;

import com.islam.backend.domain.dto.ChatMessageDto;
import com.islam.backend.domain.entities.ChatMessageEntity;
import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.mapper.ChatMessageMapper;
import com.islam.backend.repositories.JummahRepository;
import jakarta.annotation.PostConstruct;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ChatMessageMapperImpl implements ChatMessageMapper {

    private final ModelMapper modelMapper;
    private final JummahRepository jummahRepository;

    public ChatMessageMapperImpl(ModelMapper modelMapper, JummahRepository jummahRepository) {
        this.modelMapper = modelMapper;
        this.jummahRepository = jummahRepository;
    }

    @PostConstruct
    public void init() {
        if (modelMapper.getTypeMap(ChatMessageEntity.class, ChatMessageDto.class) == null) {
            modelMapper.typeMap(ChatMessageEntity.class, ChatMessageDto.class)
                    .addMappings(mapper -> {
                        mapper.map(
                                src -> Optional.ofNullable(src.getJummah())
                                        .map(JummahEntity::getId)
                                        .orElse(null),
                                ChatMessageDto::setJummahId
                        );
                    });
        }
    }

    @Override
    public ChatMessageDto mapTo(ChatMessageEntity chatMessageEntity) {
        return modelMapper.map(chatMessageEntity, ChatMessageDto.class);
    }

    @Override
    public ChatMessageEntity mapFrom(ChatMessageDto chatMessageDto) {
        ChatMessageEntity chatMessageEntity = modelMapper.map(chatMessageDto, ChatMessageEntity.class);

        if (chatMessageDto.getJummahId() != null) {
            jummahRepository.findById(chatMessageDto.getJummahId())
                    .ifPresent(chatMessageEntity::setJummah);
        }

        return chatMessageEntity;
    }
}