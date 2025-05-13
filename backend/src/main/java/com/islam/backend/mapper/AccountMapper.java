package com.islam.backend.mapper;

import com.islam.backend.domain.dto.account.response.AccountPublicResponse;
import com.islam.backend.domain.entities.AccountEntity;

public interface AccountMapper {

    AccountPublicResponse toPublicResponse(AccountEntity entity);
}
