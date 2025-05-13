package com.islam.backend.controller;

import com.islam.backend.domain.dto.jummah.request.JummahCreateRequest;
import com.islam.backend.domain.dto.jummah.response.JummahCreateResponse;
import com.islam.backend.domain.dto.jummah.response.JummahDetailResponse;
import com.islam.backend.security.user.AppUserDetails;
import com.islam.backend.services.jummah.JummahPublicService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/jummah/public")
@AllArgsConstructor
public class JummahPublicController {

    private final JummahPublicService jummahPublicService;

    @PostMapping
    public ResponseEntity<JummahCreateResponse> createJummah(
            @RequestBody JummahCreateRequest request,
            @AuthenticationPrincipal AppUserDetails principal
    ) {
        JummahCreateResponse response = jummahPublicService.save(request, principal);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/detail/{jummahId}")
    public ResponseEntity<JummahDetailResponse> findById(
            @PathVariable UUID jummahId
    ) {
        JummahDetailResponse response = jummahPublicService.findById(jummahId);
        return ResponseEntity.ok(response);
    }

}
