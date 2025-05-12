package com.islam.backend.services;

import com.islam.backend.domain.dto.AccountDto;
import com.islam.backend.domain.entities.value.Geolocation;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccountService {
    AccountDto save(AccountDto accountDto);
    List<AccountDto> findAll();
    Optional<AccountDto> findById(UUID id);
    Optional<AccountDto> findByEmail(String email);
    boolean existsById(UUID id);
    boolean existsByEmail(String email);
    void deleteById(UUID id);
    List<AccountDto> findNearby(Geolocation geolocation, double radiusInKm);
    boolean updateGeolocation(UUID id, Geolocation geolocation);
}
