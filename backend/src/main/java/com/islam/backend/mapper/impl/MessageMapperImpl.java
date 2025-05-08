package com.islam.backend.mapper.impl;

import com.islam.backend.domain.dto.MessageDto;
import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.domain.entities.MessageEntity;
import com.islam.backend.enums.MessageType;
import com.islam.backend.mapper.Mapper;
import com.islam.backend.repositories.JummahRepository;
import jakarta.annotation.PostConstruct;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class MessageMapperImpl implements Mapper<MessageEntity, MessageDto> {

    private final ModelMapper modelMapper;
    private final JummahRepository jummahRepository;

    public MessageMapperImpl(ModelMapper modelMapper, JummahRepository jummahRepository) {
        this.modelMapper = modelMapper;
        this.jummahRepository = jummahRepository;
    }

    @PostConstruct
    public void init() {
        if(modelMapper.getTypeMap(MessageEntity.class, MessageDto.class) == null) {
            modelMapper.typeMap(MessageEntity.class, MessageDto.class)
                    .addMappings(mapper -> {
                        mapper.map(
                                src -> Optional.ofNullable(src.getRoom())
                                        .map(JummahEntity::getId)
                                        .orElse(null),
                                MessageDto::setRoomId
                        );
                        mapper.map(
                                src -> Optional.ofNullable(src.getType())
                                        .map(Enum::name)
                                        .orElse(null),
                                MessageDto::setType
                        );
                        mapper.map(
                                MessageEntity::getContent,
                                MessageDto::setContent
                        );
                    });
        }
    }

    @Override
    public MessageDto mapTo(MessageEntity messageEntity) {
        return modelMapper.map(messageEntity, MessageDto.class);
    }

    @Override
    public MessageEntity mapFrom(MessageDto messageDto) {
        MessageEntity messageEntity = modelMapper.map(messageDto, MessageEntity.class);

        if(messageDto.getRoomId() != null) {
            jummahRepository.findById(messageDto.getRoomId())
                    .ifPresent(messageEntity::setRoom);
        }

        if(messageDto.getType() != null) {
            try {
                messageEntity.setType(MessageType.valueOf(messageDto.getType()));
            } catch (IllegalArgumentException e) {
                // Default to CHAT if the type is invalid
                messageEntity.setType(MessageType.CHAT);
            }
        }

        return messageEntity;
    }
}