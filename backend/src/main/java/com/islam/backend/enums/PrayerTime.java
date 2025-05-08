package com.islam.backend.enums;

import lombok.Getter;

@Getter
public enum PrayerTime {
    FAJR("Fajr"),
    DHUHR("Dhuhr"),
    ASR("Asr"),
    MAGHRIB("Maghrib"),
    ISHA("Isha"),
    JUMUAH("Jumu'ah");

    private final String displayName;

    PrayerTime(String displayName) {
        this.displayName = displayName;
    }
}
