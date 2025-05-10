package com.islam.backend.mapper.impl;

import com.islam.backend.domain.entities.JummahEntity;
import com.islam.backend.domain.response.JummahMapResponse;
import com.islam.backend.mapper.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class JummahMapMapperImpl implements Mapper<JummahEntity, JummahMapResponse> {

    private final ModelMapper modelMapper;
    private final GeolocationMapperImpl geolocationMapper;

    public JummahMapMapperImpl(ModelMapper modelMapper, GeolocationMapperImpl geolocationMapper) {
        this.modelMapper = modelMapper;
        this.geolocationMapper = geolocationMapper;
    }


    @Override
    public JummahMapResponse mapTo(JummahEntity jummahEntity) {
        JummahMapResponse response = modelMapper.map(jummahEntity, JummahMapResponse.class);

        if (jummahEntity.getGeolocation() != null) {
            response.setGeolocation(geolocationMapper.mapTo(jummahEntity.getGeolocation()));
        }

        if (jummahEntity.getOrganizer() != null) {
            response.setVerifiedOrganizer(jummahEntity.getOrganizer().isVerified());
        } else {
            response.setVerifiedOrganizer(false);
        }

        return response;
    }
}
