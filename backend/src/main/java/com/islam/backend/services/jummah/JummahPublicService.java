package com.islam.backend.services.jummah;

import com.islam.backend.domain.dto.jummah.request.JummahCreateRequest;
import com.islam.backend.domain.dto.jummah.response.JummahCreateResponse;
import com.islam.backend.domain.dto.jummah.response.JummahDetailResponse;
import com.islam.backend.domain.dto.jummah.response.JummahMapResponse;
import com.islam.backend.security.user.AppUserDetails;

import java.util.List;
import java.util.UUID;

public interface JummahPublicService {

    JummahCreateResponse save(JummahCreateRequest request, AppUserDetails principal);

    List<JummahMapResponse> findAllJummahLocation();

    JummahDetailResponse findById(UUID id);

    boolean updateJummah(UUID id, JummahCreateRequest request);

    boolean addAttendee(UUID jummahId, UUID accountId);

    boolean removeAttendee(UUID jummahId, UUID accountId);

    void deleteById(UUID id);

}
