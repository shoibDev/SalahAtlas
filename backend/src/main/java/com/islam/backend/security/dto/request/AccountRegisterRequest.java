package com.islam.backend.security.dto.request;

import com.islam.backend.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountRegisterRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private Gender gender;
}