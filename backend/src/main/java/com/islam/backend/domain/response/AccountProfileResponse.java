package com.islam.backend.domain.response;

import lombok.Data;

import java.util.UUID;

@Data
public class AccountProfileResponse {

    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String gender;
    private boolean verified;
}
