package com.islam.backend.services.account.impl;

import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.domain.entities.value.Geolocation;
import com.islam.backend.domain.request.AccountUpdateRequest;
import com.islam.backend.domain.response.AccountPublicResponse;
import com.islam.backend.enums.Gender;
import com.islam.backend.mapper.impl.AccountPublicMapperImpl;
import com.islam.backend.repositories.AccountRepository;
import com.islam.backend.services.account.AccountPublicService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class AccountPublicServiceImpl implements AccountPublicService {

    private final AccountRepository accountRepository;
    private final AccountPublicMapperImpl accountPublicMapper;

    public AccountPublicServiceImpl(AccountRepository accountRepository,
                                    AccountPublicMapperImpl accountPublicMapper) {
        this.accountRepository = accountRepository;
        this.accountPublicMapper = accountPublicMapper;
    }


    @Override
    @Transactional
    public AccountPublicResponse save(UUID id, AccountUpdateRequest accountUpdateRequest) {
        return accountRepository.findById(id)
                .map(account -> {
                    account.setFirstName(accountUpdateRequest.getFirstName());
                    account.setLastName(accountUpdateRequest.getLastName());
                    account.setGender(Gender.valueOf(accountUpdateRequest.getGender()));
                    AccountEntity saved = accountRepository.save(account);
                    return accountPublicMapper.mapTo(saved);
                })
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    @Override
    public Optional<AccountPublicResponse> findById(UUID id) {
        return accountRepository.findById(id)
                .map(accountPublicMapper::mapTo);
    }

    @Override
    public Optional<AccountPublicResponse> findByEmail(String email) {
        return accountRepository.findByEmail(email)
                .map(accountPublicMapper::mapTo);
    }

    @Override
    public boolean existsById(UUID id) {
        return accountRepository.existsById(id);
    }

    @Override
    public boolean existsByEmail(String email) {
        return accountRepository.findByEmail(email).isPresent();
    }

    @Override
    @Transactional
    public boolean updateGeolocation(UUID id, Geolocation geolocation) {
        return accountRepository.findById(id).map(account -> {
            account.setGeolocation(geolocation);
            accountRepository.save(account);
            return true;
        }).orElse(false);
    }
}
