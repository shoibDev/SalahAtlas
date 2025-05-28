package com.islam.backend.exceptions;

/**
 * Base exception class for all application-specific exceptions.
 * All custom exceptions in the application should extend this class.
 */
public abstract class ApplicationException extends RuntimeException {
    
    /**
     * Constructs a new application exception with the specified detail message.
     *
     * @param message the detail message
     */
    public ApplicationException(String message) {
        super(message);
    }
    
    /**
     * Constructs a new application exception with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause the cause of the exception
     */
    public ApplicationException(String message, Throwable cause) {
        super(message, cause);
    }
}