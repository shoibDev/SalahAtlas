package com.islam.backend.exceptions;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Global exception handler for the application.
 * This class handles all exceptions thrown by the application and returns appropriate error responses.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles ApplicationException and its subclasses.
     * Uses the HTTP status from the @ResponseStatus annotation if present.
     */
    @ExceptionHandler(ApplicationException.class)
    public ResponseEntity<ErrorResponse> handleApplicationException(ApplicationException ex, HttpServletRequest request) {
        HttpStatus status = resolveStatus(ex);
        ErrorResponse errorResponse = createErrorResponse(ex.getMessage(), status, request.getRequestURI());

        // Add validation errors if available
        if (ex instanceof ValidationException) {
            errorResponse.setErrors(((ValidationException) ex).getErrors());
        }

        return ResponseEntity.status(status).body(errorResponse);
    }

    /**
     * Handles EntityNotFoundException by converting it to ResourceNotFoundException.
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFound(EntityNotFoundException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        ErrorResponse errorResponse = createErrorResponse(ex.getMessage(), status, request.getRequestURI());
        return ResponseEntity.status(status).body(errorResponse);
    }

    /**
     * Handles UsernameNotFoundException by converting it to AuthenticationException.
     */
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUsernameNotFound(UsernameNotFoundException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        ErrorResponse errorResponse = createErrorResponse(ex.getMessage(), status, request.getRequestURI());
        return ResponseEntity.status(status).body(errorResponse);
    }

    /**
     * Handles BadCredentialsException by converting it to AuthenticationException.
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        ErrorResponse errorResponse = createErrorResponse("Invalid username or password", status, request.getRequestURI());
        return ResponseEntity.status(status).body(errorResponse);
    }

    /**
     * Handles AccessDeniedException.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.FORBIDDEN;
        ErrorResponse errorResponse = createErrorResponse("Access denied", status, request.getRequestURI());
        return ResponseEntity.status(status).body(errorResponse);
    }

    /**
     * Handles validation exceptions from @Valid annotations.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());

        ErrorResponse errorResponse = createErrorResponse("Validation failed", status, request.getRequestURI(), errors);
        return ResponseEntity.status(status).body(errorResponse);
    }

    /**
     * Handles binding exceptions.
     */
    @ExceptionHandler(BindException.class)
    public ResponseEntity<ErrorResponse> handleBindExceptions(
            BindException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());

        ErrorResponse errorResponse = createErrorResponse("Binding failed", status, request.getRequestURI(), errors);
        return ResponseEntity.status(status).body(errorResponse);
    }

    /**
     * Handles missing request parameters.
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingParams(
            MissingServletRequestParameterException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        String error = ex.getParameterName() + " parameter is missing";

        ErrorResponse errorResponse = createErrorResponse(error, status, request.getRequestURI());
        return ResponseEntity.status(status).body(errorResponse);
    }

    /**
     * Handles type mismatch exceptions.
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        String error = ex.getName() + " should be of type " + ex.getRequiredType().getSimpleName();

        ErrorResponse errorResponse = createErrorResponse(error, status, request.getRequestURI());
        return ResponseEntity.status(status).body(errorResponse);
    }

    /**
     * Handles all other exceptions.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralError(Exception ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        ErrorResponse errorResponse = createErrorResponse("An unexpected error occurred", status, request.getRequestURI());

        // Log the exception for debugging
        ex.printStackTrace();

        return ResponseEntity.status(status).body(errorResponse);
    }

    /**
     * Creates an error response with the given message, status, and path.
     */
    private ErrorResponse createErrorResponse(String message, HttpStatus status, String path) {
        return new ErrorResponse(
                message,
                status.value(),
                LocalDateTime.now().toInstant(ZoneOffset.UTC).toEpochMilli(),
                path
        );
    }

    /**
     * Creates an error response with the given message, status, path, and errors.
     */
    private ErrorResponse createErrorResponse(String message, HttpStatus status, String path, List<String> errors) {
        return new ErrorResponse(
                message,
                status.value(),
                LocalDateTime.now().toInstant(ZoneOffset.UTC).toEpochMilli(),
                path,
                errors
        );
    }

    /**
     * Resolves the HTTP status from the exception.
     */
    private HttpStatus resolveStatus(Exception ex) {
        ResponseStatus annotation = ex.getClass().getAnnotation(ResponseStatus.class);
        return (annotation != null) ? annotation.value() : HttpStatus.INTERNAL_SERVER_ERROR;
    }
}
