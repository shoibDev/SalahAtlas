package com.islam.backend.mapper.impl;

import com.islam.backend.domain.response.AccountPublicResponse;
import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.mapper.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class AccountPublicMapperImpl implements Mapper<AccountEntity, AccountPublicResponse> {

    private final ModelMapper modelMapper;

    public AccountPublicMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public AccountPublicResponse mapTo(AccountEntity accountEntity) {
        return modelMapper.map(accountEntity, AccountPublicResponse.class);
    }
}
