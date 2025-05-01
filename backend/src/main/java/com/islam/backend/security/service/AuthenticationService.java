package com.islam.backend.security.service;

import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.repositories.AccountRepository;
import com.islam.backend.security.dto.AccountLoginDto;
import com.islam.backend.security.dto.AccountRegisterDto;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final AccountRepository accountRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            AccountRepository accountRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AccountEntity signup(AccountRegisterDto input) {
        AccountEntity account = AccountEntity.builder()
                .email(input.getEmail())
                .password(passwordEncoder.encode(input.getPassword()))
                .firstName(input.getFirstName())
                .lastName(input.getLastName())
                .build();

        return accountRepository.save(account);
    }

    public AccountEntity authenticate(AccountLoginDto input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        return accountRepository.findByEmail(input.getEmail())
                .orElseThrow();
    }
}