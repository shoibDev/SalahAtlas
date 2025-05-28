package com.islam.backend.mapper.impl;

import com.islam.backend.domain.dto.jummah.request.JummahCreateRequest;
import com.islam.backend.domain.dto.jummah.response.JummahCreateResponse;
import com.islam.backend.domain.dto.jummah.response.JummahDetailResponse;
import com.islam.backend.domain.dto.jummah.response.JummahMapResponse;
import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.domain.entities.value.Geolocation;
import com.islam.backend.mapper.AccountMapper;
import com.islam.backend.mapper.JummahMapper;
import com.islam.backend.security.user.AppUserDetails;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class JummahMapperImpl implements JummahMapper {

    private final AccountMapper accountMapper;

    @Override
    public JummahEntity toEntity(JummahCreateRequest request, AppUserDetails principal) {
        return JummahEntity.builder()
                .date(request.getDate())
                .time(request.getTime())
                .geolocation(new Geolocation(request.getLatitude(), request.getLongitude()))
                .notes(request.getNotes())
                .prayerTime(request.getPrayerTime())
                .genderTarget(principal.getAccount().getGender())
                .organizer(principal.getAccount())
                .build();
    }

    @Override
    public JummahCreateResponse toCreateResponse(JummahEntity entity) {
        return JummahCreateResponse.builder()
                .id(entity.getId())
                .date(entity.getDate())
                .time(entity.getTime())
                .latitude(entity.getGeolocation().getLatitude())
                .longitude(entity.getGeolocation().getLongitude())
                .notes(entity.getNotes())
                .prayerTime(entity.getPrayerTime())
                .genderTarget(entity.getGenderTarget())
                .organizerId(entity.getOrganizer() != null ? entity.getOrganizer().getId() : null)
                .build();
    }

    @Override
    public JummahMapResponse toMapResponse(JummahEntity entity) {
        return JummahMapResponse.builder()
                .id(entity.getId())
                .latitude(entity.getGeolocation().getLatitude())
                .longitude(entity.getGeolocation().getLongitude())
                .isVerifiedOrganizer(entity.getOrganizer() != null && entity.getOrganizer().isVerified())
                .build();
    }

    @Override
    public JummahDetailResponse toDetailResponse(JummahEntity entity) {
        return JummahDetailResponse.builder()
                .id(entity.getId())
                .date(entity.getDate())
                .time(entity.getTime())
                .prayerTime(entity.getPrayerTime())
                .notes(entity.getNotes())
                .latitude(entity.getGeolocation().getLatitude())
                .longitude(entity.getGeolocation().getLongitude())
                .organizer(accountMapper.toPublicResponse(entity.getOrganizer()))
                .attendees(
                        entity.getAttendees() != null
                                ? entity.getAttendees().stream()
                                .map(accountMapper::toPublicResponse)
                                .toList()
                                : List.of()
                )
                .build();
    }

}
