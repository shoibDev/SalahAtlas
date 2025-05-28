package com.islam.backend.services.jummah;

import com.islam.backend.domain.entities.JummahEntity;

import java.util.UUID;

public interface JummahService {

    JummahEntity findById(UUID id);


}
