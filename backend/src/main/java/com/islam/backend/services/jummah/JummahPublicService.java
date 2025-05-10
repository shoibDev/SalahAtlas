package com.islam.backend.services.jummah;

import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.domain.entities.value.Geolocation;
import com.islam.backend.domain.response.JummahDetailResponse;
import com.islam.backend.domain.response.JummahMapResponse;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JummahPublicService {

    List<JummahMapResponse> findAllForMap(AccountEntity user);
    List<JummahMapResponse> findNearbyForMap(Geolocation geolocation, double radiusInKm);
    Optional<JummahDetailResponse> findDetailById(UUID id);
    boolean addAttendee(UUID jummahId, UUID accountId);
    boolean removeAttendee(UUID jummahId, UUID accountId);
    boolean deleteById(UUID id, AccountEntity currentUser);
}
