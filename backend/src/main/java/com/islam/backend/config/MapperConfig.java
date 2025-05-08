package com.islam.backend.config;

import com.islam.backend.domain.entities.AccountEntity;
import com.islam.backend.domain.entities.JummahEntity;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.UUID;

@Configuration
public class MapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        if (modelMapper.getTypeMap(AccountEntity.class, UUID.class) == null) {
                modelMapper.createTypeMap(AccountEntity.class, UUID.class)
                    .setConverter(ctx -> ctx.getSource().getId());
        }
        if (modelMapper.getTypeMap(JummahEntity.class, UUID.class) == null) {
            modelMapper.createTypeMap(JummahEntity.class, UUID.class)
                .setConverter(ctx -> ctx.getSource().getId());
        }
        return modelMapper;
    }
}
