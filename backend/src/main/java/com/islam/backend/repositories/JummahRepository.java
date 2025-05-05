package com.islam.backend.repositories;

import com.islam.backend.domain.entities.JummahEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface JummahRepository extends JpaRepository<JummahEntity, UUID> {
}
