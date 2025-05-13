package com.islam.backend.services.jummah.impl;

import com.islam.backend.domain.dto.JummahDto;
import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.domain.entities.value.Geolocation;
import com.islam.backend.mapper.impl.JummahMapperImpll;
import com.islam.backend.repositories.AccountRepository;
import com.islam.backend.repositories.JummahRepository;
import com.islam.backend.services.jummah.JummahService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class JummahServiceImpl implements JummahService {

    private final JummahRepository jummahRepository;
    private final AccountRepository accountRepository;
    private final JummahMapperImpll jummahMapper;

    public JummahServiceImpl(JummahRepository jummahRepository, AccountRepository accountRepository, JummahMapperImpll jummahMapper) {
        this.jummahRepository = jummahRepository;
        this.accountRepository = accountRepository;
        this.jummahMapper = jummahMapper;
    }

    @Override
    @Transactional
    public JummahDto save(JummahDto jummahDto) {
        JummahEntity jummahEntity = jummahMapper.mapFrom(jummahDto);

        JummahEntity savedEntity = jummahRepository.save(jummahEntity);
        return jummahMapper.mapTo(savedEntity);
    }

    @Override
    public List<JummahDto> findAll() {
        return jummahRepository.findAll().stream()
                .map(jummahMapper::mapTo)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<JummahDto> findById(UUID id) {
        return jummahRepository.findById(id)
                .map(jummahMapper::mapTo);
    }

    @Override
    public boolean existsById(UUID id) {
        return jummahRepository.existsById(id);
    }

    @Override
    @Transactional
    public void deleteById(UUID id) {
        jummahRepository.deleteById(id);
    }

    @Override
    public List<JummahDto> findNearby(Geolocation geolocation, double radiusInKm) {
        // Calculate distance using Haversine formula
        // For simplicity, we'll fetch all and filter in memory
        // In a production environment, this should be done with a spatial database query
        double lat1 = geolocation.getLatitude();
        double lon1 = geolocation.getLongitude();

        return jummahRepository.findAll().stream()
                .filter(jummah -> {
                    if (jummah.getGeolocation() == null) {
                        return false;
                    }
                    double lat2 = jummah.getGeolocation().getLatitude();
                    double lon2 = jummah.getGeolocation().getLongitude();
                    double distance = calculateDistance(lat1, lon1, lat2, lon2);
                    return distance <= radiusInKm;
                })
                .map(jummahMapper::mapTo)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean addAttendee(UUID jummahId, UUID accountId) {
        Optional<JummahEntity> jummahOpt = jummahRepository.findById(jummahId);
        Optional<AccountEntity> accountOpt = accountRepository.findById(accountId);

        if (jummahOpt.isPresent() && accountOpt.isPresent()) {
            JummahEntity jummah = jummahOpt.get();
            AccountEntity account = accountOpt.get();

            if (jummah.getAttendees() == null || !jummah.getAttendees().contains(account)) {
                jummah.getAttendees().add(account);
                jummahRepository.save(jummah);
                return true;
            }
        }
        return false;
    }

    @Override
    @Transactional
    public boolean removeAttendee(UUID jummahId, UUID accountId) {
        Optional<JummahEntity> jummahOpt = jummahRepository.findById(jummahId);
        Optional<AccountEntity> accountOpt = accountRepository.findById(accountId);

        if (jummahOpt.isPresent() && accountOpt.isPresent()) {
            JummahEntity jummah = jummahOpt.get();
            AccountEntity account = accountOpt.get();

            if (jummah.getAttendees() != null && jummah.getAttendees().contains(account)) {
                jummah.getAttendees().remove(account);
                jummahRepository.save(jummah);
                return true;
            }
        }
        return false;
    }

    @Override
    public List<JummahDto> findByOrganizerId(UUID organizerId) {
        return jummahRepository.findAll().stream()
                .filter(jummah -> jummah.getOrganizer() != null && 
                        jummah.getOrganizer().getId().equals(organizerId))
                .map(jummahMapper::mapTo)
                .collect(Collectors.toList());
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
