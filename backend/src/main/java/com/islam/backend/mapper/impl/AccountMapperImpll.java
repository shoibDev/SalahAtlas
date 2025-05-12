package com.islam.backend.mapper.impl;

import com.islam.backend.domain.dto.AccountDto;
import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.mapper.Mapper;
import com.islam.backend.repositories.JummahRepository;
import jakarta.annotation.PostConstruct;
import org.hibernate.Hibernate;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Component
public class AccountMapperImpll implements Mapper<AccountEntity, AccountDto> {

    private final ModelMapper modelMapper;
    private final JummahRepository jummahRepository;
    private final GeolocationMapperImpl geolocationMapper;

    public AccountMapperImpll(ModelMapper modelMapper, JummahRepository jummahRepository, GeolocationMapperImpl geolocationMapper) {
        this.modelMapper = modelMapper;
        this.jummahRepository = jummahRepository;
        this.geolocationMapper = geolocationMapper;
    }

    @PostConstruct
    public void init() {
        if (modelMapper.getTypeMap(AccountEntity.class, AccountDto.class) == null) {
            modelMapper.typeMap(AccountEntity.class, AccountDto.class)
                    .addMappings(mapper -> {
                        mapper.map(
                                src -> {
                                    if (Hibernate.isInitialized(src.getAttendingJummahs()) && src.getAttendingJummahs() != null) {
                                        return src.getAttendingJummahs().stream()
                                                .map(JummahEntity::getId)
                                                .toList();
                                    } else {
                                        return List.of();
                                    }
                                },
                                AccountDto::setAttendingJummahIds
                        );
                    });
        }
    }

    @Override
    public AccountDto mapTo(AccountEntity accountEntity) {
        AccountDto accountDto = modelMapper.map(accountEntity, AccountDto.class);

        if (accountEntity.getGeolocation() != null) {
            accountDto.setGeolocation(geolocationMapper.mapTo(accountEntity.getGeolocation()));
        }

        return accountDto;
    }

    @Override
    public AccountEntity mapFrom(AccountDto accountDto) {
        AccountEntity accountEntity = modelMapper.map(accountDto, AccountEntity.class);

        if(accountDto.getAttendingJummahIds() != null){
            List<JummahEntity> attendingJummahs = StreamSupport
                   .stream(jummahRepository.findAllById(accountDto.getAttendingJummahIds()).spliterator(), false)
                   .collect(Collectors.toList());
            accountEntity.setAttendingJummahs(attendingJummahs);
        }

        if (accountDto.getGeolocation() != null) {
            accountEntity.setGeolocation(geolocationMapper.mapFrom(accountDto.getGeolocation()));
        }

        return accountEntity;
    }
}
