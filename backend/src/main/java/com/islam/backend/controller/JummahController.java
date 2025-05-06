package com.islam.backend.controller;

import com.islam.backend.domain.dto.GeolocationDto;
import com.islam.backend.domain.dto.JummahDto;
import com.islam.backend.domain.entities.value.Geolocation;
import com.islam.backend.mapper.impl.GeolocationMapperImpl;
import com.islam.backend.services.JummahService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/jummahs")
public class JummahController {

    private final JummahService jummahService;
    private final GeolocationMapperImpl geolocationMapper;

    public JummahController(JummahService jummahService, GeolocationMapperImpl geolocationMapper) {
        this.jummahService = jummahService;
        this.geolocationMapper = geolocationMapper;
    }

    @GetMapping
    public ResponseEntity<List<JummahDto>> getAllJummahs() {
        return ResponseEntity.ok(jummahService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JummahDto> getJummahById(@PathVariable UUID id) {
        return jummahService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<JummahDto> createJummah(@RequestBody JummahDto jummahDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(jummahService.save(jummahDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JummahDto> updateJummah(@PathVariable UUID id, @RequestBody JummahDto jummahDto) {
        if (!jummahService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        jummahDto.setId(id);
        return ResponseEntity.ok(jummahService.save(jummahDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJummah(@PathVariable UUID id) {
        if (!jummahService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        jummahService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<JummahDto>> getNearbyJummahs(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "10.0") double radiusInKm) {

        Geolocation geolocation = Geolocation.builder()
                .latitude(latitude)
                .longitude(longitude)
                .build();

        return ResponseEntity.ok(jummahService.findNearby(geolocation, radiusInKm));
    }

    @PatchMapping("/{id}/geolocation")
    public ResponseEntity<JummahDto> updateGeolocation(
            @PathVariable UUID id,
            @RequestBody GeolocationDto geolocationDto) {

        if (!jummahService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        return jummahService.findById(id)
                .map(jummahDto -> {
                    jummahDto.setGeolocation(geolocationDto);
                    return ResponseEntity.ok(jummahService.save(jummahDto));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{jummahId}/attendees/{accountId}")
    public ResponseEntity<Void> addAttendee(
            @PathVariable UUID jummahId,
            @PathVariable UUID accountId) {

        boolean added = jummahService.addAttendee(jummahId, accountId);

        if (added) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{jummahId}/attendees/{accountId}")
    public ResponseEntity<Void> removeAttendee(
            @PathVariable UUID jummahId,
            @PathVariable UUID accountId) {

        boolean removed = jummahService.removeAttendee(jummahId, accountId);

        if (removed) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<List<JummahDto>> getJummahsByOrganizer(@PathVariable UUID organizerId) {
        return ResponseEntity.ok(jummahService.findByOrganizerId(organizerId));
    }
}
