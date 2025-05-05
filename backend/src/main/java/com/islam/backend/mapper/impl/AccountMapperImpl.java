package com.islam.backend.mapper.impl;

import com.islam.backend.domain.dto.AccountDto;
import com.islam.backend.domain.dto.JummahDto;
import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.mapper.Mapper;
import com.islam.backend.repositories.JummahRepository;
import jakarta.annotation.PostConstruct;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Component
public class AccountMapperImpl implements Mapper<AccountEntity, AccountDto> {

    private final ModelMapper modelMapper;
    private final JummahRepository jummahRepository;

    public AccountMapperImpl(ModelMapper modelMapper, JummahRepository jummahRepository) {
        this.modelMapper = modelMapper;
        this.jummahRepository = jummahRepository;
    }

    @PostConstruct
    public void init() {
        if(modelMapper.getTypeMap(AccountEntity.class, AccountDto.class) == null){
            modelMapper.typeMap(AccountEntity.class, AccountDto.class)
                    .addMappings(mapper -> {
                       mapper.map(
                               src -> Optional.ofNullable(src.getOrganizedJummahs())
                                       .orElse(List.of())
                                       .stream().map(JummahEntity::getId).toList(),
                               AccountDto::setOrganizedJummahIds
                       );
                       mapper.map(
                               src -> Optional.ofNullable(src.getAttendingJummahs())
                                       .orElse(List.of())
                                       .stream().map(JummahEntity::getId).toList(),
                               AccountDto::setAttendingJummahIds
                       );
                    });
        }
    }

    @Override
    public AccountDto mapTo(AccountEntity accountEntity) {
        return modelMapper.map(accountEntity, AccountDto.class);
    }

    @Override
    public AccountEntity mapFrom(AccountDto accountDto) {
        AccountEntity accountEntity = modelMapper.map(accountDto, AccountEntity.class);

        if(accountDto.getOrganizedJummahIds() != null){
           List<JummahEntity> organizedJummahs = StreamSupport
                   .stream(jummahRepository.findAllById(accountDto.getOrganizedJummahIds()).spliterator(), false)
                   .collect(Collectors.toList());
           accountEntity.setOrganizedJummahs(organizedJummahs);
        }
        if(accountDto.getAttendingJummahIds() != null){
            List<JummahEntity> attendingJummahs = StreamSupport
                   .stream(jummahRepository.findAllById(accountDto.getAttendingJummahIds()).spliterator(), false)
                   .collect(Collectors.toList());
            accountEntity.setAttendingJummahs(attendingJummahs);
        }
        return accountEntity;
    }
}
