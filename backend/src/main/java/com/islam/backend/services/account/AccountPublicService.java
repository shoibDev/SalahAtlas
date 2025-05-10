package com.islam.backend.services.account;

import com.islam.backend.domain.entities.value.Geolocation;
import com.islam.backend.domain.request.AccountUpdateRequest;
import com.islam.backend.domain.response.AccountPublicResponse;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccountPublicService {

    AccountPublicResponse save(UUID id, AccountUpdateRequest accountUpdateRequest);

    Optional<AccountPublicResponse> findById(UUID id);

    boolean existsById(UUID id);

    Optional<AccountPublicResponse> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean updateGeolocation(UUID id, Geolocation geolocation);

}
