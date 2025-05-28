package com.islam.backend.exceptions;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

/**
 * Standard error response format for the API.
 * This class provides a consistent structure for all error responses.
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    private String message;
    private int status;
    private long timestamp;
    private String path;
    private List<String> errors;

    /**
     * Constructs a new ErrorResponse with the specified message, status, and timestamp.
     *
     * @param message the error message
     * @param status the HTTP status code
     * @param timestamp the timestamp when the error occurred
     */
    public ErrorResponse(String message, int status, long timestamp) {
        this.message = message;
        this.status = status;
        this.timestamp = timestamp;
    }

    /**
     * Constructs a new ErrorResponse with the specified message, status, and current timestamp.
     *
     * @param message the error message
     * @param status the HTTP status code
     */
    public ErrorResponse(String message, int status) {
        this(message, status, LocalDateTime.now().toInstant(ZoneOffset.UTC).toEpochMilli());
    }

    /**
     * Constructs a new ErrorResponse with the specified message, status, timestamp, and path.
     *
     * @param message the error message
     * @param status the HTTP status code
     * @param timestamp the timestamp when the error occurred
     * @param path the path of the request that caused the error
     */
    public ErrorResponse(String message, int status, long timestamp, String path) {
        this(message, status, timestamp);
        this.path = path;
    }

    /**
     * Constructs a new ErrorResponse with the specified message, status, timestamp, and validation errors.
     *
     * @param message the error message
     * @param status the HTTP status code
     * @param timestamp the timestamp when the error occurred
     * @param errors the list of validation errors
     */
    public ErrorResponse(String message, int status, long timestamp, List<String> errors) {
        this(message, status, timestamp);
        this.errors = new ArrayList<>(errors);
    }

    /**
     * Constructs a new ErrorResponse with the specified message, status, timestamp, path, and validation errors.
     *
     * @param message the error message
     * @param status the HTTP status code
     * @param timestamp the timestamp when the error occurred
     * @param path the path of the request that caused the error
     * @param errors the list of validation errors
     */
    public ErrorResponse(String message, int status, long timestamp, String path, List<String> errors) {
        this(message, status, timestamp, path);
        this.errors = new ArrayList<>(errors);
    }
}
