package com.islam.backend.services.account.impl;

import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.repositories.AccountRepository;
import com.islam.backend.services.account.AccountService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AccountServiceImpl implements AccountService {

    AccountRepository accountRepository;
    public AccountServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

}
