package com.islam.backend.services.account;

import com.islam.backend.domain.dto.account.response.AccountPublicResponse;

import java.util.UUID;

public interface AccountPublicService {

    AccountPublicResponse findById(UUID id);

}
