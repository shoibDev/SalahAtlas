package com.islam.backend.services;

import com.islam.backend.domain.dto.JummahDto;
import com.islam.backend.domain.entities.value.Geolocation;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JummahService {
    JummahDto save(JummahDto jummahDto);
    List<JummahDto> findAll();
    Optional<JummahDto> findById(UUID id);
    boolean existsById(UUID id);
    void deleteById(UUID id);
    List<JummahDto> findNearby(Geolocation geolocation, double radiusInKm);
    boolean addAttendee(UUID jummahId, UUID accountId);
    boolean removeAttendee(UUID jummahId, UUID accountId);
    List<JummahDto> findByOrganizerId(UUID organizerId);
}
