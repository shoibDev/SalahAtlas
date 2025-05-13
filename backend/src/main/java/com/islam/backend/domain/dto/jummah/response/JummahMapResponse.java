package com.islam.backend.domain.dto.jummah.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JummahMapResponse {
    private UUID id;
    private double latitude;
    private double longitude;
    private boolean isVerifiedOrganizer;
}
