package com.islam.backend.services.account.impl;

import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.domain.entities.value.Geolocation;
import com.islam.backend.repositories.AccountRepository;
import com.islam.backend.services.account.AccountBackendService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AccountBackendServiceImpl implements AccountBackendService {

    private final AccountRepository accountRepository;

    public AccountBackendServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public List<AccountEntity> findNearby(Geolocation geolocation, double radiusInKm) {
        double lat1 = geolocation.getLatitude();
        double lon1 = geolocation.getLongitude();

        return accountRepository.findAll().stream()
                .filter(account -> {
                    if (account.getGeolocation() == null) return false;

                    double lat2 = account.getGeolocation().getLatitude();
                    double lon2 = account.getGeolocation().getLongitude();
                    double distance = calculateDistance(lat1, lon1, lat2, lon2);

                    return distance <= radiusInKm;
                })
                .collect(Collectors.toList());
    }

    // Haversine formula to calculate distance between two points on Earth
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
}
