package com.islam.backend.controller;

import com.islam.backend.domain.dto.jummah.request.JummahCreateRequest;
import com.islam.backend.domain.dto.jummah.response.JummahCreateResponse;
import com.islam.backend.domain.dto.jummah.response.JummahDetailResponse;
import com.islam.backend.domain.dto.jummah.response.JummahMapResponse;
import com.islam.backend.domain.dto.response.ApiResponse;
import com.islam.backend.exceptions.AuthenticationException;
import com.islam.backend.security.user.AppUserDetails;
import com.islam.backend.services.jummah.JummahPublicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/jummah/public")
@RequiredArgsConstructor
public class JummahPublicController {

    private final JummahPublicService jummahPublicService;

    /**
     * Create a new Jummah event.
     *
     * @param request The Jummah creation request
     * @param principal The authenticated user
     * @return The created Jummah
     */
    @PostMapping
    public ResponseEntity<ApiResponse<JummahCreateResponse>> createJummah(
            @RequestBody JummahCreateRequest request,
            @AuthenticationPrincipal AppUserDetails principal
    ) {
        JummahCreateResponse response = jummahPublicService.save(request, principal);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Jummah created successfully"));
    }

    /**
     * Get Jummah details by ID.
     *
     * @param jummahId The Jummah ID
     * @return The Jummah details
     */
    @GetMapping("/detail/{jummahId}")
    public ResponseEntity<ApiResponse<JummahDetailResponse>> findById(
            @PathVariable UUID jummahId
    ) {
        JummahDetailResponse response = jummahPublicService.findById(jummahId);
        return ResponseEntity.ok(ApiResponse.success(response, "Jummah details retrieved successfully"));
    }

    /**
     * Find Jummah events near a location.
     *
     * @param latitude The latitude coordinate
     * @param longitude The longitude coordinate
     * @param radius The search radius in kilometers
     * @return List of Jummah events within the radius
     */
    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse<List<JummahMapResponse>>> findNearby(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "1") Integer radius
    ) {
        List<JummahMapResponse> response = jummahPublicService.findNearbyByRadius(latitude, longitude, radius);
        return ResponseEntity.ok(ApiResponse.success(response, 
                "Found " + response.size() + " Jummah events within " + radius + " km"));
    }

    /**
     * Update a Jummah event.
     *
     * @param jummahId The Jummah ID
     * @param request The update request
     * @return Success status
     */
    @PutMapping("/{jummahId}")
    public ResponseEntity<ApiResponse<Boolean>> updateJummah(
            @PathVariable UUID jummahId,
            @RequestBody JummahCreateRequest request
    ) {
        boolean updated = jummahPublicService.updateJummah(jummahId, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Jummah updated successfully"));
    }

    /**
     * Add an attendee to a Jummah event.
     *
     * @param jummahId The Jummah ID
     * @param accountId The account ID to add as attendee
     * @return Success status
     */
    @PostMapping("/{jummahId}/attendee/{accountId}")
    public ResponseEntity<ApiResponse<Boolean>> addAttendee(
            @PathVariable UUID jummahId,
            @PathVariable UUID accountId
    ) {
        boolean added = jummahPublicService.addAttendee(jummahId, accountId);
        String message = added ? "Attendee added successfully" : "Attendee already exists or is the organizer";
        return ResponseEntity.ok(ApiResponse.success(added, message));
    }

    /**
     * Remove an attendee from a Jummah event.
     * Only the organizer can remove attendees.
     *
     * @param jummahId The Jummah ID
     * @param accountId The account ID to remove
     * @param principal The authenticated user
     * @return Success status
     */
    @DeleteMapping("/{jummahId}/attendee/{accountId}")
    public ResponseEntity<ApiResponse<Boolean>> removeAttendee(
            @PathVariable UUID jummahId,
            @PathVariable UUID accountId,
            @AuthenticationPrincipal AppUserDetails principal
    ) {
        // Get the Jummah details to check if the current user is the owner
        JummahDetailResponse jummah = jummahPublicService.findById(jummahId);

        // Only the owner can remove attendees
        if (principal == null || jummah.getOrganizer() == null || 
            !principal.getAccount().getId().equals(jummah.getOrganizer().getId())) {
            throw new AuthenticationException("Only the organizer can remove attendees");
        }

        boolean removed = jummahPublicService.removeAttendee(jummahId, accountId);
        String message = removed ? "Attendee removed successfully" : "Attendee not found";
        return ResponseEntity.ok(ApiResponse.success(removed, message));
    }

    /**
     * Delete a Jummah event.
     *
     * @param jummahId The Jummah ID
     * @return No content response
     */
    @DeleteMapping("/{jummahId}")
    public ResponseEntity<ApiResponse<Void>> deleteJummah(
            @PathVariable UUID jummahId
    ) {
        jummahPublicService.deleteById(jummahId);
        return ResponseEntity.ok(ApiResponse.success("Jummah deleted successfully"));
    }
}
