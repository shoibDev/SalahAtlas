package com.islam.backend.security.controller;

import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.security.dto.request.AccountLoginRequest;
import com.islam.backend.security.dto.request.AccountRegisterRequest;
import com.islam.backend.security.dto.response.AccountLoginResponse;
import com.islam.backend.security.services.AuthenticationService;
import com.islam.backend.security.services.JwtService;
import com.islam.backend.security.user.AppUserDetails;
import org.modelmapper.ModelMapper;
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
    private final ModelMapper modelMapper;

    public AuthenticationController(
            JwtService jwtService,
            AuthenticationService authenticationService,
            UserDetailsService userDetailsService,
            ModelMapper modelMapper
    ) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.userDetailsService = userDetailsService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("/signup")
    public ResponseEntity<AccountRegisterRequest> register(
            @RequestBody AccountRegisterRequest request) {

        AccountEntity registeredUser = authenticationService.signup(request);
        AccountRegisterRequest response = modelMapper.map(registeredUser, AccountRegisterRequest.class);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AccountLoginResponse> authenticate(@RequestBody AccountLoginRequest request) {
        AppUserDetails authenticatedUser = authenticationService.authenticate(request);

        String jwtToken = jwtService.generateAccessToken(authenticatedUser);
        String refreshToken = jwtService.generateRefreshToken(authenticatedUser);

        AccountLoginResponse loginResponse = AccountLoginResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AccountLoginResponse> refreshToken(
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
                AccountLoginResponse.builder()
                        .accessToken(newAccessToken)
                        .refreshToken(newRefreshToken)
                        .build()
        );
    }
}