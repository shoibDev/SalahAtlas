package com.islam.backend.services.jummah.impl;

import com.islam.backend.domain.dto.jummah.request.JummahCreateRequest;
import com.islam.backend.domain.dto.jummah.response.JummahCreateResponse;
import com.islam.backend.domain.dto.jummah.response.JummahDetailResponse;
import com.islam.backend.domain.dto.jummah.response.JummahMapResponse;
import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.domain.entities.value.Geolocation;
import com.islam.backend.exceptions.ResourceNotFoundException;
import com.islam.backend.mapper.impl.JummahMapperImpl;
import com.islam.backend.repositories.AccountRepository;
import com.islam.backend.repositories.JummahRepository;
import com.islam.backend.security.user.AppUserDetails;
import com.islam.backend.services.jummah.JummahPublicService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.islam.backend.utils.GeoMath.haversineDistance;

@Service
@AllArgsConstructor
public class JummahPublicServiceImpl implements JummahPublicService {

    private final JummahRepository jummahRepository;
    private final AccountRepository accountRepository;
    private final JummahMapperImpl jummahMapper;

    @Override
    public JummahCreateResponse save(JummahCreateRequest request, AppUserDetails principal) {
        JummahEntity entity = jummahMapper.toEntity(request, principal);
        return jummahMapper.toCreateResponse(jummahRepository.save(entity));
    }

    @Override
    public List<JummahMapResponse> findAllJummahLocation() {
        return jummahRepository.findAll().stream()
                .filter(jummah -> jummah.getGeolocation() != null)
                .map(jummahMapper::toMapResponse)
                .toList();
    }

    @Override
    public JummahDetailResponse findById(UUID id) {
        JummahEntity entity = jummahRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jummah", id));
        return jummahMapper.toDetailResponse(entity);
    }

    @Override
    public boolean updateJummah(UUID id, JummahCreateRequest request) {
        JummahEntity entity = jummahRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jummah", id));

        // Update fields from request
        if (request.getTime() != null) {
            entity.setTime(request.getTime());
        }
        if (request.getNotes() != null) {
            entity.setNotes(request.getNotes());
        }
        if (request.getPrayerTime() != null) {
            entity.setPrayerTime(request.getPrayerTime());
        }

        // Update geolocation if latitude and longitude are provided
        if (request.getLatitude() != 0 && request.getLongitude() != 0) {
            entity.setGeolocation(new Geolocation(request.getLatitude(), request.getLongitude()));
        }

        jummahRepository.save(entity);
        return true;
    }

    @Override
    public boolean addAttendee(UUID jummahId, UUID accountId) {
        JummahEntity jummah = jummahRepository.findById(jummahId)
                .orElseThrow(() -> new ResourceNotFoundException("Jummah", jummahId));

        // Check if the account is already in the attendees list
        if (jummah.getAttendees() != null && jummah.getAttendees().stream()
                .anyMatch(account -> account.getId().equals(accountId))) {
            return false; // Already an attendee
        }

        // Check if the account is the organizer
        if (jummah.getOrganizer() != null && jummah.getOrganizer().getId().equals(accountId)) {
            return false; // Don't add the owner to attendees
        }

        // Fetch the account entity
        AccountEntity accountEntity = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account", accountId));

        // Initialize attendees list if null
        if (jummah.getAttendees() == null) {
            jummah.setAttendees(new ArrayList<>());
        }

        // Add the account to attendees
        jummah.getAttendees().add(accountEntity);

        jummahRepository.save(jummah);
        return true;
    }

    @Override
    public boolean removeAttendee(UUID jummahId, UUID accountId) {
        JummahEntity jummah = jummahRepository.findById(jummahId)
                .orElseThrow(() -> new ResourceNotFoundException("Jummah", jummahId));

        // Check if the account to remove exists in the attendees list
        if (jummah.getAttendees() == null || jummah.getAttendees().stream()
                .noneMatch(account -> account.getId().equals(accountId))) {
            return false; // Account not found in attendees
        }

        // Remove the account from attendees
        jummah.getAttendees().removeIf(account -> account.getId().equals(accountId));
        jummahRepository.save(jummah);
        return true;
    }

    @Override
    public void deleteById(UUID id) {
        jummahRepository.deleteById(id);
    }

    @Override
    public List<JummahMapResponse> findNearbyByRadius(Double latitude, Double longitude, Integer radius) {
        return jummahRepository.findAll().stream()
                .filter(jummah -> jummah.getGeolocation() != null)
                .filter(jummah -> {
                    double distance = haversineDistance(latitude, longitude, jummah.getGeolocation().getLatitude(), jummah.getGeolocation().getLongitude());
                    return distance <= radius;
                })
                .map(jummahMapper::toMapResponse)
                .toList();
    }
}
