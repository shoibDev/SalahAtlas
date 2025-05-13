package com.islam.backend.services.jummah.impl;

import com.islam.backend.domain.dto.jummah.request.JummahCreateRequest;
import com.islam.backend.domain.dto.jummah.response.JummahCreateResponse;
import com.islam.backend.domain.dto.jummah.response.JummahDetailResponse;
import com.islam.backend.domain.dto.jummah.response.JummahMapResponse;
import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.mapper.impl.JummahMapperImpl;
import com.islam.backend.repositories.JummahRepository;
import com.islam.backend.security.user.AppUserDetails;
import com.islam.backend.services.jummah.JummahPublicService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class JummahPublicServiceImpl implements JummahPublicService {

    private final JummahRepository jummahRepository;
    private final JummahMapperImpl jummahMapper;

    @Override
    public JummahCreateResponse save(JummahCreateRequest request, AppUserDetails principal) {
        JummahEntity entity = jummahMapper.toEntity(request, principal);
        return jummahMapper.toCreateResponse(jummahRepository.save(entity));
    }

    @Override
    public List<JummahMapResponse> findAllJummahLocation() {
        return jummahRepository.findAll().stream()
                .filter(jummah -> jummah.getGeolocation() != null)
                .map(jummahMapper::toMapResponse)
                .toList();
    }

    @Override
    public JummahDetailResponse findById(UUID id) {
        JummahEntity entity = jummahRepository.findById(id).orElse(null);
        assert entity != null;
        return jummahMapper.toDetailResponse(entity);
    }

    @Override
    public boolean updateJummah(UUID id, JummahCreateRequest request) {
        return false;
    }

    @Override
    public boolean addAttendee(UUID jummahId, UUID accountId) {
        return false;
    }

    @Override
    public boolean removeAttendee(UUID jummahId, UUID accountId) {
        return false;
    }

    @Override
    public void deleteById(UUID id) {
        jummahRepository.deleteById(id);
    }
}
