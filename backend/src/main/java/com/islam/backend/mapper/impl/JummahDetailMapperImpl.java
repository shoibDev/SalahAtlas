package com.islam.backend.mapper.impl;

import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.domain.response.AccountPublicResponse;
import com.islam.backend.domain.response.JummahDetailResponse;
import com.islam.backend.mapper.Mapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class JummahDetailMapperImpl implements Mapper<JummahEntity, JummahDetailResponse> {

    private final GeolocationMapperImpl geolocationMapper;
    private final AccountPublicMapperImpl accountPublicMapper;

    public JummahDetailMapperImpl(
                                  GeolocationMapperImpl geolocationMapper,
                                  AccountPublicMapperImpl accountPublicMapper) {

        this.geolocationMapper = geolocationMapper;
        this.accountPublicMapper = accountPublicMapper;
    }

    @Override
    public JummahDetailResponse mapTo(JummahEntity entity) {
        JummahDetailResponse response = new JummahDetailResponse();

        response.setId(entity.getId());
        response.setDate(entity.getDate());
        response.setTime(entity.getTime());

        response.setPrayerTime(
                Optional.ofNullable(entity.getPrayerTime())
                        .map(Enum::name)
                        .orElse(null)
        );

        response.setNotes(entity.getNotes());

        if (entity.getGeolocation() != null) {
            response.setGeolocation(geolocationMapper.mapTo(entity.getGeolocation()));
        }

        if (entity.getOrganizer() != null) {
            response.setOrganizer(accountPublicMapper.mapTo(entity.getOrganizer()));
        }

        if (entity.getAttendees() != null) {
            List<AccountPublicResponse> attendeeResponses = entity.getAttendees().stream()
                    .map(accountPublicMapper::mapTo)
                    .collect(Collectors.toList());
            response.setAttendees(attendeeResponses);
        }

        return response;
    }
}
