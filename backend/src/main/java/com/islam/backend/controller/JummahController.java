package com.islam.backend.controller;

import com.islam.backend.domain.dto.GeolocationDto;
import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.domain.entities.value.Geolocation;
import com.islam.backend.domain.response.JummahDetailResponse;
import com.islam.backend.domain.response.JummahMapResponse;
import com.islam.backend.mapper.impl.GeolocationMapperImpl;
import com.islam.backend.services.jummah.JummahPublicService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/jummahs")
public class JummahController {

    private final JummahPublicService jummahPublicService;
    private final GeolocationMapperImpl geolocationMapper;

    public JummahController(JummahPublicService jummahPublicService, GeolocationMapperImpl geolocationMapper) {
        this.jummahPublicService = jummahPublicService;
        this.geolocationMapper = geolocationMapper;
    }

    /**
     * Return a lightweight list of nearby jummahs for the map
     */
    @GetMapping("/nearby")
    public ResponseEntity<List<JummahMapResponse>> getNearbyJummahs(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "10.0") double radiusInKm) {

        Geolocation geolocation = Geolocation.builder()
                .latitude(latitude)
                .longitude(longitude)
                .build();

        List<JummahMapResponse> nearby = jummahPublicService.findNearbyForMap(geolocation, radiusInKm);
        return ResponseEntity.ok(nearby);
    }

    /**
     * Return all jummahs in lightweight format (for public listing/map)
     */
    @GetMapping("/map")
    public ResponseEntity<List<JummahMapResponse>> getAllForMap(@AuthenticationPrincipal AccountEntity principal) {

        return ResponseEntity.ok(jummahPublicService.findAllForMap(principal));
    }

    /**
     * Return full jummah detail when user clicks a pin
     */
    @GetMapping("/{id}")
    public ResponseEntity<JummahDetailResponse> getDetail(@PathVariable UUID id) {
        Optional<JummahDetailResponse> detail = jummahPublicService.findDetailById(id);
        return detail.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Add attendee to a jummah
     */
    @PostMapping("/{jummahId}/attendees/{accountId}")
    public ResponseEntity<Void> addAttendee(
            @PathVariable UUID jummahId,
            @PathVariable UUID accountId) {

        boolean added = jummahPublicService.addAttendee(jummahId, accountId);
        return added ? ResponseEntity.noContent().build() : ResponseEntity.badRequest().build();
    }

    /**
     * Remove attendee from a jummah
     */
    @DeleteMapping("/{jummahId}/attendees/{accountId}")
    public ResponseEntity<Void> removeAttendee(
            @PathVariable UUID jummahId,
            @PathVariable UUID accountId) {

        boolean removed = jummahPublicService.removeAttendee(jummahId, accountId);
        return removed ? ResponseEntity.noContent().build() : ResponseEntity.badRequest().build();
    }

    /**
     * Delete a jummah — restricted to the organizer only
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJummah(
            @PathVariable UUID id,
            @AuthenticationPrincipal AccountEntity principal) {

        boolean deleted = jummahPublicService.deleteById(id, principal);

        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
