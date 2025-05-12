package com.islam.backend.mapper.impl;

import com.islam.backend.domain.dto.GeolocationDto;
import com.islam.backend.domain.entities.value.Geolocation;
import com.islam.backend.mapper.GeolocationMapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class GeolocationMapperImpl implements GeolocationMapper {

    private final ModelMapper modelMapper;

    public GeolocationMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public GeolocationDto mapTo(Geolocation geolocation) {
        return modelMapper.map(geolocation, GeolocationDto.class);
    }

    @Override
    public Geolocation mapFrom(GeolocationDto geolocationDto) {
        return modelMapper.map(geolocationDto, Geolocation.class);
    }
}