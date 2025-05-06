package com.islam.backend.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JummahDto {
    private UUID id;
    private LocalDate date;
    private LocalTime time;
    private String prayerTime;
    private String genderTarget;
    private String notes;
    private boolean verified;
    private UUID organizerId;
    private List<UUID> attendeeIds;
    private GeolocationDto geolocation;
}
