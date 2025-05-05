package com.islam.backend.domain.entities.value;

import jakarta.persistence.Embeddable;

@Embeddable
public class Geolocation {
    private double latitude;
    private double longitude;
}
