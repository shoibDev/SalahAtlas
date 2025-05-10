package com.islam.backend.domain.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountPublicResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private boolean verified;
}
