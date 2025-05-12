package com.islam.backend.controller;

import com.islam.backend.domain.dto.AccountDto;
import com.islam.backend.domain.dto.GeolocationDto;
import com.islam.backend.domain.entities.value.Geolocation;
import com.islam.backend.mapper.impl.GeolocationMapperImpl;
import com.islam.backend.services.AccountService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/accounts")
public class AccountController  {

    private final AccountService accountService;
    private final GeolocationMapperImpl geolocationMapper;

    public AccountController(AccountService accountService, GeolocationMapperImpl geolocationMapper) {
        this.accountService = accountService;
        this.geolocationMapper = geolocationMapper;
    }

    @GetMapping
    public ResponseEntity<List<AccountDto>> getAllAccounts() {
        return ResponseEntity.ok(accountService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountDto> getAccountById(@PathVariable UUID id) {
        return accountService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<AccountDto> getAccountByEmail(@PathVariable String email) {
        return accountService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AccountDto> createAccount(@RequestBody AccountDto accountDto) {
        if (accountService.existsByEmail(accountDto.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(accountService.save(accountDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountDto> updateAccount(@PathVariable UUID id, @RequestBody AccountDto accountDto) {
        if (!accountService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // Check if email is being changed and if it already exists
        if (accountDto.getEmail() != null && 
            !accountService.findById(id).get().getEmail().equals(accountDto.getEmail()) &&
            accountService.existsByEmail(accountDto.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        accountDto.setId(id);
        return ResponseEntity.ok(accountService.save(accountDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable UUID id) {
        if (!accountService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        accountService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<AccountDto>> getNearbyAccounts(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "10.0") double radiusInKm) {

        Geolocation geolocation = Geolocation.builder()
                .latitude(latitude)
                .longitude(longitude)
                .build();

        return ResponseEntity.ok(accountService.findNearby(geolocation, radiusInKm));
    }

    @PatchMapping("/{id}/geolocation")
    public ResponseEntity<Void> updateGeolocation(
            @PathVariable UUID id,
            @RequestBody GeolocationDto geolocationDto) {

        Geolocation geolocation = geolocationMapper.mapFrom(geolocationDto);
        boolean updated = accountService.updateGeolocation(id, geolocation);

        if (updated) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
