package com.islam.backend.security.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountLoginResponse {
    private String accessToken;
    private String refreshToken;
    private String userId;
}
