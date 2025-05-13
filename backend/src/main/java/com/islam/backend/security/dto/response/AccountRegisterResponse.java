package com.islam.backend.security.dto.response;

import com.islam.backend.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountRegisterResponse {
    private String email;
    private String firstName;
    private String lastName;
    private Gender gender;
}