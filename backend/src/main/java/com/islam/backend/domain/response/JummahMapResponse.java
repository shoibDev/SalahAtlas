package com.islam.backend.domain.response;

import com.islam.backend.domain.dto.GeolocationDto;
import lombok.Data;

import java.util.UUID;

@Data
public class JummahMapResponse {
    private UUID id;
    private GeolocationDto geolocation;
    private boolean isVerifiedOrganizer;
}
