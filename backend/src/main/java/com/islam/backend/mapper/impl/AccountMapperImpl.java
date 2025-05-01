package com.islam.backend.mapper.impl;

import com.islam.backend.domain.dto.AccountDto;
import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.mapper.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class AccountMapperImpl implements Mapper<AccountEntity, AccountDto> {

    private final ModelMapper modelMapper;
    public AccountMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public AccountDto mapTo(AccountEntity accountEntity) {
        return modelMapper.map(accountEntity, AccountDto.class);
    }

    @Override
    public AccountEntity mapFrom(AccountDto accountDto) {
        return modelMapper.map(accountDto, AccountEntity.class);
    }
}
