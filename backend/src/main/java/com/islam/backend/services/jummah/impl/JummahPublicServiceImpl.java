package com.islam.backend.services.jummah.impl;

import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.domain.entities.value.Geolocation;
import com.islam.backend.domain.response.JummahDetailResponse;
import com.islam.backend.domain.response.JummahMapResponse;
import com.islam.backend.enums.Gender;
import com.islam.backend.mapper.impl.JummahDetailMapperImpl;
import com.islam.backend.mapper.impl.JummahMapMapperImpl;
import com.islam.backend.repositories.AccountRepository;
import com.islam.backend.repositories.JummahRepository;
import com.islam.backend.services.jummah.JummahPublicService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class JummahPublicServiceImpl implements JummahPublicService {

    private final JummahRepository jummahRepository;
    private final AccountRepository accountRepository;
    private final JummahMapMapperImpl jummahMapMapper;
    private final JummahDetailMapperImpl jummahDetailMapper;

    public JummahPublicServiceImpl(JummahRepository jummahRepository,
                                   JummahMapMapperImpl jummahMapMapper,
                                   JummahDetailMapperImpl jummahDetailMapper,
                                   AccountRepository accountRepository) {
        this.jummahRepository = jummahRepository;
        this.jummahMapMapper = jummahMapMapper;
        this.jummahDetailMapper = jummahDetailMapper;
        this.accountRepository = accountRepository;
    }

    public List<JummahMapResponse> findAllForMap(AccountEntity user) {
        Gender userGender = user.getGender();

        return jummahRepository.findAll().stream()
                .filter(j -> j.getGenderTarget() == null || j.getGenderTarget() == userGender)
                .map(jummahMapMapper::mapTo)
                .toList();
    }

    @Override
    public List<JummahMapResponse> findNearbyForMap(Geolocation geolocation, double radiusInKm) {
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
                .map(jummahMapMapper::mapTo)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<JummahDetailResponse> findDetailById(UUID id) {
        return jummahRepository.findById(id).map(jummahDetailMapper::mapTo);
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
                Objects.requireNonNull(jummah.getAttendees()).add(account);
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
    public boolean deleteById(UUID id, AccountEntity currentUser) {
        Optional<JummahEntity> jummahOpt = jummahRepository.findById(id);

        if (jummahOpt.isPresent()) {
            JummahEntity jummah = jummahOpt.get();

            // Check if the current user is the organizer
            if (jummah.getOrganizer() != null && 
                jummah.getOrganizer().getId().equals(currentUser.getId())) {
                jummahRepository.deleteById(id);
                return true;
            }
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
