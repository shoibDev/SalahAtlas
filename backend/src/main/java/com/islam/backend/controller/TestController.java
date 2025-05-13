package com.islam.backend.controller;

import com.islam.backend.domain.dto.response.ApiResponse;
import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.domain.entities.value.Geolocation;
import com.islam.backend.repositories.JummahRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Test controller for development purposes only.
 * This controller should be disabled in production environments.
 */
@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@Profile("!prod") // Disable in production
public class TestController {

    private final JummahRepository jummahRepository;

    /**
     * Create a test Jummah entity.
     *
     * @param principal The authenticated user
     * @return Success response
     */
    @PostMapping()
    public ResponseEntity<ApiResponse<JummahEntity>> createJummah(@AuthenticationPrincipal AccountEntity principal) {
        JummahEntity jummah = JummahEntity.builder()
                .date(LocalDate.now())
                .time(LocalTime.now())
                .geolocation(new Geolocation(123.0, 123.0))
                .notes("Hello world")
                .organizer(principal)
                .build();

        JummahEntity savedJummah = jummahRepository.save(jummah);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(savedJummah, "Test Jummah created successfully"));
    }
}
