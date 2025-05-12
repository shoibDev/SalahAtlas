package com.islam.backend.domain.dto.jummah.response;

import com.islam.backend.domain.dto.GeolocationDto;
import com.islam.backend.domain.dto.account.response.AccountPublicResponse;
import com.islam.backend.enums.PrayerTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JummahDetailResponse {
    private UUID id;
    private LocalDate date;
    private LocalTime time;
    private PrayerTime prayerTime;
    private String notes;
    private double latitude;
    private double longitude;
    private AccountPublicResponse organizer;
    private List<AccountPublicResponse> attendees;
}