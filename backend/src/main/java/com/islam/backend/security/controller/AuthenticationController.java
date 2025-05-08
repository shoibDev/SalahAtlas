package com.islam.backend.security.controller;

import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.security.dto.AccountLoginDto;
import com.islam.backend.security.dto.AccountRegisterDto;
import com.islam.backend.security.dto.LoginResponseDto;
import com.islam.backend.security.services.AuthenticationService;
import com.islam.backend.security.services.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {

    private final JwtService jwtService;
    private final AuthenticationService authenticationService;
    private final UserDetailsService userDetailsService;

    public AuthenticationController(
            JwtService jwtService,
            AuthenticationService authenticationService,
            UserDetailsService userDetailsService
    ) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AccountRegisterDto> register(@RequestBody AccountRegisterDto accountRegisterDto) {
        AccountEntity registeredUser = authenticationService.signup(accountRegisterDto);

        AccountRegisterDto response = AccountRegisterDto.builder()
                .email(registeredUser.getEmail())
                .password(registeredUser.getPassword())
                .firstName(registeredUser.getFirstName())
                .lastName(registeredUser.getLastName())
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> authenticate(@RequestBody AccountLoginDto accountLoginDto) {
        AccountEntity authenticatedUser = authenticationService.authenticate(accountLoginDto);

        String jwtToken = jwtService.generateAccessToken(authenticatedUser);
        String refreshToken = jwtService.generateRefreshToken(authenticatedUser);

        LoginResponseDto loginResponse = LoginResponseDto.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDto> refreshToken(
            @RequestHeader("Authorization") String refreshTokenHeader
    ) {
        if (refreshTokenHeader == null || !refreshTokenHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String refreshToken = refreshTokenHeader.substring(7);
        String username = jwtService.extractUsername(refreshToken);

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (!jwtService.isTokenValid(refreshToken, userDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String newAccessToken = jwtService.generateAccessToken(userDetails);
        String newRefreshToken = jwtService.generateRefreshToken(userDetails);

        return ResponseEntity.ok(
                LoginResponseDto.builder()
                        .accessToken(newAccessToken)
                        .refreshToken(newRefreshToken)
                        .build()
        );
    }
}