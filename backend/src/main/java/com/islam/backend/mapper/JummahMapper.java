package com.islam.backend.mapper;

import com.islam.backend.domain.dto.jummah.request.JummahCreateRequest;
import com.islam.backend.domain.dto.jummah.response.JummahCreateResponse;
import com.islam.backend.domain.dto.jummah.response.JummahDetailResponse;
import com.islam.backend.domain.dto.jummah.response.JummahMapResponse;
import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.security.user.AppUserDetails;

public interface JummahMapper {

    JummahEntity toEntity(JummahCreateRequest request, AppUserDetails principal);
    JummahCreateResponse toCreateResponse(JummahEntity entity);
    JummahMapResponse toMapResponse(JummahEntity entity);
    JummahDetailResponse toDetailResponse(JummahEntity entity);
}
