package com.islam.backend.services.account.impl;

import com.islam.backend.domain.dto.account.response.AccountPublicResponse;
import com.islam.backend.mapper.AccountMapper;
import com.islam.backend.repositories.AccountRepository;
import com.islam.backend.services.account.AccountPublicService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class AccountPublicServiceImpl implements AccountPublicService {

    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;

    @Override
    public AccountPublicResponse findById(UUID id) {
        return accountRepository.findById(id)
                .map(accountMapper::toPublicResponse)
                .orElseThrow(() -> new EntityNotFoundException("Account with ID " + id + " not found"));
    }
}
