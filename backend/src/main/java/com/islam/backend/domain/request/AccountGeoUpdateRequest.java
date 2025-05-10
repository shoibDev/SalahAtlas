package com.islam.backend.domain.request;

import com.islam.backend.domain.dto.GeolocationDto;
import lombok.Data;

import java.util.UUID;

@Data
public class AccountGeoUpdateRequest {
    private UUID id;
    private GeolocationDto geolocation;
}
