package com.islam.backend.domain.dto.jummah.response;

import com.islam.backend.enums.Gender;
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
public class JummahCreateResponse {
    private UUID id;
    private LocalDate date;
    private LocalTime time;
    private double latitude;
    private double longitude;
    private String notes;
    private PrayerTime prayerTime;
    private Gender genderTarget;
    private UUID organizerId;
}
