package com.islam.backend.services.impl;

import com.islam.backend.mapper.impl.AccountMapperImpl;
import com.islam.backend.repositories.AccountRepository;
import com.islam.backend.services.AccountService;
import org.springframework.stereotype.Service;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final AccountMapperImpl accountMapper;

    public AccountServiceImpl(AccountRepository accountRepository, AccountMapperImpl accountMapper) {
        this.accountRepository = accountRepository;
        this.accountMapper = accountMapper;
    }
}
