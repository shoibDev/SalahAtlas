package com.islam.backend.services.account;

import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.domain.entities.value.Geolocation;

import java.util.List;
import java.util.Optional;

public interface AccountBackendService {
    List<AccountEntity> findNearby(Geolocation geolocation, double radiusInKm);
}
