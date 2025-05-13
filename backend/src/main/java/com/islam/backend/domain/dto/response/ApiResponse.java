package com.islam.backend.domain.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

/**
 * Standard response format for all API endpoints.
 * This class provides a consistent structure for all responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private long timestamp;

    /**
     * Creates a successful response with data.
     *
     * @param data The data to include in the response
     * @param <T> The type of the data
     * @return A new ApiResponse instance
     */
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .timestamp(LocalDateTime.now().toInstant(ZoneOffset.UTC).toEpochMilli())
                .build();
    }

    /**
     * Creates a successful response with data and a message.
     *
     * @param data The data to include in the response
     * @param message The success message
     * @param <T> The type of the data
     * @return A new ApiResponse instance
     */
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now().toInstant(ZoneOffset.UTC).toEpochMilli())
                .build();
    }

    /**
     * Creates a successful response with just a message.
     *
     * @param message The success message
     * @return A new ApiResponse instance
     */
    public static <T> ApiResponse<T> success(String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .timestamp(LocalDateTime.now().toInstant(ZoneOffset.UTC).toEpochMilli())
                .build();
    }

    /**
     * Creates an error response with a message.
     *
     * @param message The error message
     * @param <T> The type of the data (usually Void)
     * @return A new ApiResponse instance
     */
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .timestamp(LocalDateTime.now().toInstant(ZoneOffset.UTC).toEpochMilli())
                .build();
    }
}