package com.islam.backend.controller;


import com.islam.backend.domain.dto.GeolocationDto;
import com.islam.backend.domain.entities.value.Geolocation;
import com.islam.backend.domain.request.AccountUpdateRequest;
import com.islam.backend.domain.response.AccountPublicResponse;
import com.islam.backend.mapper.impl.GeolocationMapperImpl;
import com.islam.backend.services.account.AccountPublicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/accounts")
public class AccountController  {

    private final AccountPublicService accountPublicService;
    private final GeolocationMapperImpl geolocationMapper;

    public AccountController(AccountPublicService accountPublicService, GeolocationMapperImpl geolocationMapper) {
        this.accountPublicService = accountPublicService;
        this.geolocationMapper = geolocationMapper;
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountPublicResponse> getAccountById(@PathVariable UUID id) {
        return accountPublicService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<AccountPublicResponse> getAccountByEmail(@PathVariable String email) {
        return accountPublicService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Only gets called if they are changing everyhting excluding their email or password..
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAccount(
            @PathVariable UUID id, @RequestBody AccountUpdateRequest accountUpdateRequest) {
        if (accountPublicService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(accountPublicService.save(id, accountUpdateRequest));
    }


    @PatchMapping("/{id}/geolocation")
    public ResponseEntity<Void> updateGeolocation(
            @PathVariable UUID id,
            @RequestBody GeolocationDto geolocationDto) {

        Geolocation geolocation = geolocationMapper.mapFrom(geolocationDto);
        boolean updated = accountPublicService.updateGeolocation(id, geolocation);

        if (updated) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
