package com.islam.backend.mapper.impl;

import com.islam.backend.domain.dto.JummahDto;
import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.mapper.Mapper;
import com.islam.backend.repositories.AccountRepository;
import jakarta.annotation.PostConstruct;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Component
public class JummahMapperImpll implements Mapper<JummahEntity, JummahDto> {

    private final ModelMapper modelMapper;
    private final AccountRepository accountRepository;
    private final GeolocationMapperImpl geolocationMapper;

    public JummahMapperImpll(ModelMapper modelMapper, AccountRepository accountRepository, GeolocationMapperImpl geolocationMapper) {
        this.modelMapper = modelMapper;
        this.accountRepository = accountRepository;
        this.geolocationMapper = geolocationMapper;
    }

    @PostConstruct
    public void init() {
        if(modelMapper.getTypeMap(JummahEntity.class, JummahDto.class) == null) {
            modelMapper.typeMap(JummahEntity.class, JummahDto.class)
                    .addMappings(mapper -> {
                        mapper.map(
                                src -> Optional.ofNullable(src.getOrganizer())
                                        .map(AccountEntity::getId)
                                        .orElse(null),
                                JummahDto::setOrganizerId
                        );
                        mapper.map(
                                src -> Optional.ofNullable(src.getAttendees())
                                        .orElse(List.of())
                                        .stream().map(AccountEntity::getId).toList(),
                                JummahDto::setAttendeeIds
                        );
                        mapper.map(
                                src -> Optional.ofNullable(src.getPrayerTime())
                                        .map(Enum::name)
                                        .orElse(null),
                                JummahDto::setPrayerTime
                        );
                        mapper.map(
                                src -> Optional.ofNullable(src.getGenderTarget())
                                        .map(Enum::name)
                                        .orElse(null),
                                JummahDto::setGenderTarget
                        );
                    });
        }
    }

    @Override
    public JummahDto mapTo(JummahEntity jummahEntity) {
        JummahDto jummahDto = modelMapper.map(jummahEntity, JummahDto.class);

        if (jummahEntity.getGeolocation() != null) {
            jummahDto.setGeolocation(geolocationMapper.mapTo(jummahEntity.getGeolocation()));
        }

        return jummahDto;
    }

    @Override
    public JummahEntity mapFrom(JummahDto jummahDto) {
        JummahEntity jummahEntity = modelMapper.map(jummahDto, JummahEntity.class);

        if(jummahDto.getOrganizerId() != null) {
            accountRepository.findById(jummahDto.getOrganizerId())
                    .ifPresent(jummahEntity::setOrganizer);
        }

        if(jummahDto.getAttendeeIds() != null) {
            List<AccountEntity> attendees = StreamSupport
                    .stream(accountRepository.findAllById(jummahDto.getAttendeeIds()).spliterator(), false)
                    .collect(Collectors.toList());
            jummahEntity.setAttendees(attendees);
        }

        if (jummahDto.getGeolocation() != null) {
            jummahEntity.setGeolocation(geolocationMapper.mapFrom(jummahDto.getGeolocation()));
        }


        return jummahEntity;
    }
}
