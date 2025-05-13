package com.islam.backend.services.jummah.impl;

import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.repositories.JummahRepository;
import com.islam.backend.services.jummah.JummahService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class JummahServiceImpl implements JummahService {

    private final JummahRepository jummahRepository;


    @Override
    public JummahEntity findById(UUID id) {
        return jummahRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Jummah with ID " + id + " not found"));
    }
}
