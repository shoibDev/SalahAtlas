package com.islam.backend.controller;

import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.domain.entities.value.Geolocation;
import com.islam.backend.repositories.JummahRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/test")
public class TestController {

    private final JummahRepository jummahRepository;

    public TestController(JummahRepository jummahRepository) {
        this.jummahRepository = jummahRepository;
    }

    @PostMapping()
    public void createJummah(@AuthenticationPrincipal AccountEntity principal) {
        JummahEntity jummah = JummahEntity.builder()
                .date(LocalDate.now())
                .time(LocalTime.now())
                .geolocation(new Geolocation(123.0,123.0))
                .notes("Hello world")
                .organizer(principal)
                .build();

        jummahRepository.save(jummah);
    }
}
