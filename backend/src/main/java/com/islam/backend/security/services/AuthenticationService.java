package com.islam.backend.security.services;

import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.exceptions.AuthenticationException;
import com.islam.backend.repositories.AccountRepository;
import com.islam.backend.security.dto.request.AccountLoginRequest;
import com.islam.backend.security.dto.request.AccountRegisterRequest;
import com.islam.backend.security.user.AppUserDetails;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.Optional;
import java.util.UUID;
import java.security.SecureRandom;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import lombok.Getter;
import lombok.AllArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    /**
     * Enum representing the result of a verification attempt
     */
    @Getter
    @AllArgsConstructor
    public enum VerificationResult {
        SUCCESS("Account verified successfully"),
        INVALID_TOKEN("Invalid verification token or code"),
        EXPIRED("Verification token or code has expired"),
        ACCOUNT_LOCKED("Account is locked due to too many failed verification attempts"),
        RATE_LIMITED("Too many verification attempts in a short period");

        private final String message;
    }

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    // Maximum number of failed verification attempts before locking the account
    private static final int MAX_VERIFICATION_ATTEMPTS = 5;

    // Minimum time between verification attempts (in seconds) to prevent rapid guessing
    private static final int MIN_ATTEMPT_INTERVAL_SECONDS = 3;

    // Duration for which the account remains locked after exceeding max attempts (in minutes)
    private static final int ACCOUNT_LOCKOUT_MINUTES = 30;

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Generates a secure 6-digit verification code
     * @return A 6-digit verification code as a string
     */
    private String generateVerificationCode() {
        int code = 100000 + secureRandom.nextInt(900000); // Generates a number between 100000 and 999999
        return String.valueOf(code);
    }

    /**
     * Checks if an account is locked for verification attempts
     * @param account The account to check
     * @return true if the account is locked, false otherwise
     */
    private boolean isAccountLockedForVerification(AccountEntity account) {
        // If account is not locked, return false
        if (!account.isVerificationLocked()) {
            return false;
        }

        // If lock has expired, unlock the account and return false
        if (account.getVerificationLockExpiry() != null && 
            account.getVerificationLockExpiry().isBefore(LocalDateTime.now())) {
            account.setVerificationLocked(false);
            account.setVerificationLockExpiry(null);
            account.setVerificationAttempts(0);
            accountRepository.save(account);
            return false;
        }

        // Account is locked and lock hasn't expired
        return true;
    }

    /**
     * Records a failed verification attempt and locks the account if necessary
     * @param account The account to record the failed attempt for
     * @return true if the account is now locked, false otherwise
     */
    private boolean recordFailedVerificationAttempt(AccountEntity account) {
        LocalDateTime now = LocalDateTime.now();

        // Check for rate limiting - if last attempt was too recent
        if (account.getLastFailedVerification() != null) {
            Duration timeSinceLastAttempt = Duration.between(account.getLastFailedVerification(), now);
            if (timeSinceLastAttempt.getSeconds() < MIN_ATTEMPT_INTERVAL_SECONDS) {
                logger.warn("Rate limit exceeded for account {}: attempts too frequent", account.getEmail());
                return true; // Treat as locked for this attempt
            }
        }

        // Increment failed attempts counter
        int attempts = account.getVerificationAttempts() != null ? account.getVerificationAttempts() + 1 : 1;
        account.setVerificationAttempts(attempts);
        account.setLastFailedVerification(now);

        // Check if max attempts exceeded
        if (attempts >= MAX_VERIFICATION_ATTEMPTS) {
            account.setVerificationLocked(true);
            account.setVerificationLockExpiry(now.plusMinutes(ACCOUNT_LOCKOUT_MINUTES));
            logger.warn("Account {} locked for verification after {} failed attempts", 
                    account.getEmail(), attempts);
        }

        accountRepository.save(account);
        return account.isVerificationLocked();
    }

    public AccountEntity signup(AccountRegisterRequest request) {
        String verificationToken = UUID.randomUUID().toString();
        String verificationCode = generateVerificationCode();
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(15);

        AccountEntity account = AccountEntity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(false)
                .verificationToken(verificationToken)
                .verificationCode(verificationCode)
                .verificationTokenExpiry(expirationTime)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .gender(request.getGender())
                .build();

        AccountEntity savedAccount = accountRepository.save(account);
        emailService.sendVerificationEmail(savedAccount.getEmail(), verificationToken, verificationCode);
        return savedAccount;
    }

    public AppUserDetails authenticate(AccountLoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        AccountEntity account = accountRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> AuthenticationException.userNotFound(request.getEmail()));

        if (!account.isEnabled()) {
            throw new IllegalStateException("Please verify your email before logging in.");
        }

        return new AppUserDetails(account);
    }

    public VerificationResult verifyAccount(String token) {
        Optional<AccountEntity> optionalAccount = accountRepository.findByVerificationToken(token);

        if (optionalAccount.isEmpty()) {
            logger.warn("Verification attempt with invalid token: {}", token);
            return VerificationResult.INVALID_TOKEN;
        }

        AccountEntity account = optionalAccount.get();

        // Check if account is locked for verification
        if (isAccountLockedForVerification(account)) {
            logger.warn("Verification attempt on locked account: {}", account.getEmail());
            return VerificationResult.ACCOUNT_LOCKED;
        }

        // Check for rate limiting
        if (account.getLastFailedVerification() != null) {
            Duration timeSinceLastAttempt = Duration.between(account.getLastFailedVerification(), LocalDateTime.now());
            if (timeSinceLastAttempt.getSeconds() < MIN_ATTEMPT_INTERVAL_SECONDS) {
                logger.warn("Rate limit exceeded for account {}: attempts too frequent", account.getEmail());
                return VerificationResult.RATE_LIMITED;
            }
        }

        // Check if token has expired
        if (account.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            logger.warn("Verification attempt with expired token for account: {}", account.getEmail());
            recordFailedVerificationAttempt(account);
            return VerificationResult.EXPIRED;
        }

        // Verification successful - reset verification data and enable account
        account.setEnabled(true);
        account.setVerificationToken(null);
        account.setVerificationCode(null);
        account.setVerificationTokenExpiry(null);
        account.setVerificationAttempts(0);
        account.setLastFailedVerification(null);
        account.setVerificationLocked(false);
        account.setVerificationLockExpiry(null);

        accountRepository.save(account);
        logger.info("Account verified successfully: {}", account.getEmail());

        return VerificationResult.SUCCESS;
    }

    public VerificationResult verifyAccountByCode(String email, String code) {
        Optional<AccountEntity> optionalAccount = accountRepository.findByEmailAndVerificationCode(email, code);

        if (optionalAccount.isEmpty()) {
            logger.warn("Verification attempt with invalid code: {} for email: {}", code, email);
            return VerificationResult.INVALID_TOKEN;
        }

        AccountEntity account = optionalAccount.get();

        // Check if account is locked for verification
        if (isAccountLockedForVerification(account)) {
            logger.warn("Verification attempt on locked account: {}", account.getEmail());
            return VerificationResult.ACCOUNT_LOCKED;
        }

        // Check for rate limiting
        if (account.getLastFailedVerification() != null) {
            Duration timeSinceLastAttempt = Duration.between(account.getLastFailedVerification(), LocalDateTime.now());
            if (timeSinceLastAttempt.getSeconds() < MIN_ATTEMPT_INTERVAL_SECONDS) {
                logger.warn("Rate limit exceeded for account {}: attempts too frequent", account.getEmail());
                return VerificationResult.RATE_LIMITED;
            }
        }

        // Check if code has expired
        if (account.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            logger.warn("Verification attempt with expired code for account: {}", account.getEmail());
            recordFailedVerificationAttempt(account);
            return VerificationResult.EXPIRED;
        }

        // Verification successful - reset verification data and enable account
        account.setEnabled(true);
        account.setVerificationToken(null);
        account.setVerificationCode(null);
        account.setVerificationTokenExpiry(null);
        account.setVerificationAttempts(0);
        account.setLastFailedVerification(null);
        account.setVerificationLocked(false);
        account.setVerificationLockExpiry(null);

        accountRepository.save(account);
        logger.info("Account verified successfully by code: {}", account.getEmail());

        return VerificationResult.SUCCESS;
    }
}
