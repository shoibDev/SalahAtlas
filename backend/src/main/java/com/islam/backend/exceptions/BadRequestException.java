package com.islam.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a client sends an invalid request.
 * This exception will result in an HTTP 400 response.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadRequestException extends ApplicationException {

    /**
     * Constructs a new BadRequestException with the specified detail message.
     *
     * @param message the detail message
     */
    public BadRequestException(String message) {
        super(message);
    }

    /**
     * Constructs a new BadRequestException with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause the cause of the exception
     */
    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}