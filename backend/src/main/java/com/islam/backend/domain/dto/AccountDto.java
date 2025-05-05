package com.islam.backend.domain.dto;

import com.islam.backend.domain.entities.value.Geolocation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountDto {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private LocalDateTime createdAt;
    private Geolocation geolocation;
    private List<UUID> organizedJummahIds;
    private List<UUID> attendingJummahIds;
}