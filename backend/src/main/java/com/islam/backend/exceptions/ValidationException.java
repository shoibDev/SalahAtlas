package com.islam.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Exception thrown when validation fails.
 * This exception will result in an HTTP 400 response.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ValidationException extends BadRequestException {

    private final List<String> errors;

    /**
     * Constructs a new ValidationException with the specified detail message.
     *
     * @param message the detail message
     */
    public ValidationException(String message) {
        super(message);
        this.errors = Collections.singletonList(message);
    }

    /**
     * Constructs a new ValidationException with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause the cause of the exception
     */
    public ValidationException(String message, Throwable cause) {
        super(message, cause);
        this.errors = Collections.singletonList(message);
    }
    
    /**
     * Constructs a new ValidationException with the specified validation errors.
     *
     * @param errors the list of validation errors
     */
    public ValidationException(List<String> errors) {
        super("Validation failed: " + String.join(", ", errors));
        this.errors = new ArrayList<>(errors);
    }
    
    /**
     * Returns the list of validation errors.
     *
     * @return the list of validation errors
     */
    public List<String> getErrors() {
        return Collections.unmodifiableList(errors);
    }
    
    /**
     * Constructs a new ValidationException for an invalid argument scenario.
     *
     * @param argumentName the name of the invalid argument
     * @param reason the reason why the argument is invalid
     * @return a new ValidationException
     */
    public static ValidationException invalidArgument(String argumentName, String reason) {
        return new ValidationException("Invalid argument '" + argumentName + "': " + reason);
    }
}