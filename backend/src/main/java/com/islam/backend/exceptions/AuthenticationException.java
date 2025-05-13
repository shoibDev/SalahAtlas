package com.islam.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when authentication fails.
 * This exception will result in an HTTP 401 response.
 */
@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class AuthenticationException extends ApplicationException {

    /**
     * Constructs a new AuthenticationException with the specified detail message.
     *
     * @param message the detail message
     */
    public AuthenticationException(String message) {
        super(message);
    }

    /**
     * Constructs a new AuthenticationException with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause the cause of the exception
     */
    public AuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
    
    /**
     * Constructs a new AuthenticationException for a user not found scenario.
     *
     * @param username the username that was not found
     * @return a new AuthenticationException
     */
    public static AuthenticationException userNotFound(String username) {
        return new AuthenticationException("User not found: " + username);
    }
    
    /**
     * Constructs a new AuthenticationException for an invalid credentials scenario.
     *
     * @return a new AuthenticationException
     */
    public static AuthenticationException invalidCredentials() {
        return new AuthenticationException("Invalid username or password");
    }
    
    /**
     * Constructs a new AuthenticationException for an expired token scenario.
     *
     * @return a new AuthenticationException
     */
    public static AuthenticationException expiredToken() {
        return new AuthenticationException("Authentication token has expired");
    }
}