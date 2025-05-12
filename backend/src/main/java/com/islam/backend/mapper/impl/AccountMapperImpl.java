package com.islam.backend.mapper.impl;

import com.islam.backend.domain.dto.account.response.AccountPublicResponse;
import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.mapper.AccountMapper;
import org.springframework.stereotype.Component;

@Component
public class AccountMapperImpl implements AccountMapper {
    @Override
    public AccountPublicResponse toPublicResponse(AccountEntity entity) {
        return AccountPublicResponse.builder()
                .id(entity.getId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .verified(entity.isVerified())
                .build();
    }
}
