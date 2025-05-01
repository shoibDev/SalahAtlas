package com.islam.backend.security.dto;

import lombok.Data;

@Data
public class AccountLoginDto {
    private String email;
    private String password;
}
