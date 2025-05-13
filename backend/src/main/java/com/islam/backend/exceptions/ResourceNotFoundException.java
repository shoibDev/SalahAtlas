package com.islam.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a requested resource is not found in the database or storage.
 * This exception will result in an HTTP 404 response.
 * 
 * This is a more specific version of NotFoundException for entity/resource lookups.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends NotFoundException {

    /**
     * Constructs a new ResourceNotFoundException with the specified detail message.
     *
     * @param message the detail message
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }

    /**
     * Constructs a new ResourceNotFoundException with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause the cause of the exception
     */
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    /**
     * Constructs a new ResourceNotFoundException for a specific resource type and ID.
     *
     * @param resourceType the type of resource that was not found
     * @param id the ID of the resource that was not found
     */
    public ResourceNotFoundException(String resourceType, Object id) {
        super(resourceType + " with ID " + id + " not found");
    }
}