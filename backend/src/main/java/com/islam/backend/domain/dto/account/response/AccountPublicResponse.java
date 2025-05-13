package com.islam.backend.domain.dto.account.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountPublicResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private boolean verified;
}
