package com.islam.backend.controller;

import com.islam.backend.domain.dto.account.response.AccountPublicResponse;
import com.islam.backend.domain.dto.response.ApiResponse;
import com.islam.backend.services.account.AccountPublicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/account/public")
@RequiredArgsConstructor
public class AccountPublicController {

    private final AccountPublicService accountPublicService;

    /**
     * Get public account information by ID.
     *
     * @param id The account ID
     * @return Public account information
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountPublicResponse>> getAccountById(@PathVariable UUID id) {
        AccountPublicResponse account = accountPublicService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(account, "Account retrieved successfully"));
    }
}
