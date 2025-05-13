package com.islam.backend.controller;

import com.islam.backend.domain.dto.jummah.request.JummahCreateRequest;
import com.islam.backend.domain.dto.jummah.response.JummahCreateResponse;
import com.islam.backend.domain.dto.jummah.response.JummahDetailResponse;
import com.islam.backend.domain.dto.jummah.response.JummahMapResponse;
import com.islam.backend.security.user.AppUserDetails;
import com.islam.backend.services.jummah.JummahPublicService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/jummah/public")
@AllArgsConstructor
public class JummahPublicController {

    private final JummahPublicService jummahPublicService;

    @PostMapping
    public ResponseEntity<JummahCreateResponse> createJummah(
            @RequestBody JummahCreateRequest request,
            @AuthenticationPrincipal AppUserDetails principal
    ) {
        JummahCreateResponse response = jummahPublicService.save(request, principal);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/detail/{jummahId}")
    public ResponseEntity<JummahDetailResponse> findById(
            @PathVariable UUID jummahId
    ) {
        JummahDetailResponse response = jummahPublicService.findById(jummahId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<JummahMapResponse>> findNearby(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "1") Integer radius
    ) {
        List<JummahMapResponse> response = jummahPublicService.findNearbyByRadius(latitude, longitude, radius);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{jummahId}")
    public ResponseEntity<Boolean> updateJummah(
            @PathVariable UUID jummahId,
            @RequestBody JummahCreateRequest request
    ) {
        boolean updated = jummahPublicService.updateJummah(jummahId, request);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{jummahId}/attendee/{accountId}")
    public ResponseEntity<Boolean> addAttendee(
            @PathVariable UUID jummahId,
            @PathVariable UUID accountId
    ) {
        boolean added = jummahPublicService.addAttendee(jummahId, accountId);
        return ResponseEntity.ok(added);
    }

    @DeleteMapping("/{jummahId}/attendee/{accountId}")
    public ResponseEntity<Boolean> removeAttendee(
            @PathVariable UUID jummahId,
            @PathVariable UUID accountId,
            @AuthenticationPrincipal AppUserDetails principal
    ) {
        // Get the Jummah details to check if the current user is the owner
        JummahDetailResponse jummah = jummahPublicService.findById(jummahId);

        // Only the owner can remove attendees
        if (principal == null || jummah.getOrganizer() == null || 
            !principal.getAccount().getId().equals(jummah.getOrganizer().getId())) {
            return ResponseEntity.status(403).body(false);
        }

        boolean removed = jummahPublicService.removeAttendee(jummahId, accountId);
        return ResponseEntity.ok(removed);
    }

    @DeleteMapping("/{jummahId}")
    public ResponseEntity<Void> deleteJummah(
            @PathVariable UUID jummahId
    ) {
        jummahPublicService.deleteById(jummahId);
        return ResponseEntity.noContent().build();
    }
}
