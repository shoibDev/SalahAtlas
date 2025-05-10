package com.islam.backend.domain.request;

import lombok.Data;

import java.util.UUID;

@Data
public class AccountUpdateRequest {
    private UUID id;
    private String firstName;
    private String lastName;
    private String gender;
}
