package com.islam.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a requested resource is not found.
 * This exception will result in an HTTP 404 response.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class NotFoundException extends ApplicationException {

    /**
     * Constructs a new NotFoundException with the specified detail message.
     *
     * @param message the detail message
     */
    public NotFoundException(String message) {
        super(message);
    }

    /**
     * Constructs a new NotFoundException with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause the cause of the exception
     */
    public NotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}