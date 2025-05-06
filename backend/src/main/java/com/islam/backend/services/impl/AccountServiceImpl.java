package com.islam.backend.services.impl;

import com.islam.backend.domain.dto.AccountDto;
import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.domain.entities.value.Geolocation;
import com.islam.backend.mapper.impl.AccountMapperImpl;
import com.islam.backend.repositories.AccountRepository;
import com.islam.backend.services.AccountService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final AccountMapperImpl accountMapper;

    public AccountServiceImpl(AccountRepository accountRepository, AccountMapperImpl accountMapper) {
        this.accountRepository = accountRepository;
        this.accountMapper = accountMapper;
    }

    @Override
    @Transactional
    public AccountDto save(AccountDto accountDto) {
        AccountEntity accountEntity = accountMapper.mapFrom(accountDto);
        AccountEntity savedEntity = accountRepository.save(accountEntity);
        return accountMapper.mapTo(savedEntity);
    }

    @Override
    public List<AccountDto> findAll() {
        return accountRepository.findAll().stream()
                .map(accountMapper::mapTo)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<AccountDto> findById(UUID id) {
        return accountRepository.findById(id)
                .map(accountMapper::mapTo);
    }

    @Override
    public Optional<AccountDto> findByEmail(String email) {
        return accountRepository.findByEmail(email)
                .map(accountMapper::mapTo);
    }

    @Override
    public boolean existsById(UUID id) {
        return accountRepository.existsById(id);
    }

    @Override
    public boolean existsByEmail(String email) {
        return accountRepository.findByEmail(email).isPresent();
    }

    @Override
    @Transactional
    public void deleteById(UUID id) {
        accountRepository.deleteById(id);
    }

    @Override
    public List<AccountDto> findNearby(Geolocation geolocation, double radiusInKm) {
        // Calculate distance using Haversine formula
        // For simplicity, we'll fetch all and filter in memory
        // In a production environment, this should be done with a spatial database query
        double lat1 = geolocation.getLatitude();
        double lon1 = geolocation.getLongitude();

        return accountRepository.findAll().stream()
                .filter(account -> {
                    if (account.getGeolocation() == null) {
                        return false;
                    }
                    double lat2 = account.getGeolocation().getLatitude();
                    double lon2 = account.getGeolocation().getLongitude();
                    double distance = calculateDistance(lat1, lon1, lat2, lon2);
                    return distance <= radiusInKm;
                })
                .map(accountMapper::mapTo)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean updateGeolocation(UUID id, Geolocation geolocation) {
        Optional<AccountEntity> accountOpt = accountRepository.findById(id);

        if (accountOpt.isPresent()) {
            AccountEntity account = accountOpt.get();
            account.setGeolocation(geolocation);
            accountRepository.save(account);
            return true;
        }

        return false;
    }

    // Haversine formula to calculate distance between two points on Earth
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
