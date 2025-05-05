package com.islam.backend.security.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AccountRegisterDto {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
}