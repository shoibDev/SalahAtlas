package com.islam.backend.domain.dto.jummah.request;

import com.islam.backend.domain.entities.value.Geolocation;
import com.islam.backend.enums.PrayerTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JummahCreateRequest {
    private LocalDate date;
    private LocalTime time;
    private double latitude;
    private double longitude;
    private String notes;
    private PrayerTime prayerTime;
}
