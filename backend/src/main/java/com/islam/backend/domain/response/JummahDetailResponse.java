package com.islam.backend.domain.response;

import com.islam.backend.domain.dto.GeolocationDto;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
public class JummahDetailResponse {
    private UUID id;
    private LocalDate date;
    private LocalTime time;
    private String prayerTime;
    private String notes;
    private GeolocationDto geolocation;
    private AccountPublicResponse organizer;
    private List<AccountPublicResponse> attendees;
}
