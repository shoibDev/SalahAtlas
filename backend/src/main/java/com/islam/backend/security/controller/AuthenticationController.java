package com.islam.backend.security.controller;

import com.islam.backend.domain.dto.response.ApiResponse;
import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.exceptions.AuthenticationException;
import com.islam.backend.security.dto.request.AccountLoginRequest;
import com.islam.backend.security.dto.request.AccountRegisterRequest;
import com.islam.backend.security.dto.response.AccountLoginResponse;
import com.islam.backend.security.dto.response.AccountRegisterResponse;
import com.islam.backend.security.services.AuthenticationService;
import com.islam.backend.security.services.JwtService;
import com.islam.backend.security.user.AppUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for authentication operations.
 * Handles user registration, login, and token refresh.
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final JwtService jwtService;
    private final AuthenticationService authenticationService;
    private final UserDetailsService userDetailsService;

    /**
     * Register a new user account.
     *
     * @param request The registration request
     * @return The registered user information
     */
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AccountRegisterResponse>> register(
            @RequestBody AccountRegisterRequest request) {
        AccountEntity registeredUser = authenticationService.signup(request);

        AccountRegisterResponse response = AccountRegisterResponse.builder()
                .email(registeredUser.getEmail())
                .firstName(registeredUser.getFirstName())
                .lastName(registeredUser.getLastName())
                .gender(registeredUser.getGender())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "User registered successfully"));
    }

    /**
     * Authenticate a user and generate access and refresh tokens.
     *
     * @param request The login request
     * @return The authentication tokens
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AccountLoginResponse>> authenticate(
            @RequestBody AccountLoginRequest request) {
        AppUserDetails authenticatedUser = authenticationService.authenticate(request);

        String jwtToken = jwtService.generateAccessToken(authenticatedUser);
        String refreshToken = jwtService.generateRefreshToken(authenticatedUser);

        AccountLoginResponse loginResponse = AccountLoginResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();

        return ResponseEntity.ok(ApiResponse.success(loginResponse, "Authentication successful"));
    }

    @PostMapping("/verify")
    /**
     * Verify a user's account using a verification token or code.
     *
     * @param token The verification token (optional)
     * @param code The verification code (optional)
     * @param email The user's email (required when using code)
     * @return Response indicating success or failure
     */
    public ResponseEntity<ApiResponse<String>> verifyAccount(
            @RequestParam(value = "token", required = false) String token,
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "email", required = false) String email) {

        AuthenticationService.VerificationResult result;

        if (token != null && !token.isEmpty()) {
            result = authenticationService.verifyAccount(token);
        } else if (code != null && !code.isEmpty()) {
            if (email == null || email.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Email is required when verifying with a code"));
            }
            result = authenticationService.verifyAccountByCode(email, code);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Either token or code must be provided"));
        }

        switch (result) {
            case SUCCESS:
                return ResponseEntity.ok(ApiResponse.success("Account verified successfully"));
            case ACCOUNT_LOCKED:
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                        .body(ApiResponse.error("Account is locked due to too many failed verification attempts. Please try again later."));
            case RATE_LIMITED:
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                        .body(ApiResponse.error("Too many verification attempts. Please wait a moment before trying again."));
            case EXPIRED:
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Verification token or code has expired. Please request a new one."));
            case INVALID_TOKEN:
            default:
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Invalid verification token or code."));
        }
    }


    /**
     * Refresh an expired access token using a valid refresh token.
     *
     * @param refreshTokenHeader The Authorization header containing the refresh token
     * @return New access and refresh tokens
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AccountLoginResponse>> refreshToken(
            @RequestHeader("Authorization") String refreshTokenHeader
    ) {
        if (refreshTokenHeader == null || !refreshTokenHeader.startsWith("Bearer ")) {
            throw new AuthenticationException("Invalid refresh token format");
        }

        String refreshToken = refreshTokenHeader.substring(7);
        String username = jwtService.extractUsername(refreshToken);

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (!jwtService.isTokenValid(refreshToken, userDetails)) {
            throw new AuthenticationException("Invalid or expired refresh token");
        }

        String newAccessToken = jwtService.generateAccessToken(userDetails);
        String newRefreshToken = jwtService.generateRefreshToken(userDetails);

        AccountLoginResponse response = AccountLoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();

        return ResponseEntity.ok(ApiResponse.success(response, "Tokens refreshed successfully"));
    }
}
