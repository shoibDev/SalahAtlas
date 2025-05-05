package com.islam.backend.domain.entities;

import com.islam.backend.domain.entities.value.Geolocation;
import com.islam.backend.enums.Gender;
import com.islam.backend.enums.PrayerTime;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "jummahs")
public class JummahEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @CreatedDate
    private LocalDate date;

    private LocalTime time;

    @Embedded
    private Geolocation geolocation;

    private String notes;

    @Enumerated(EnumType.STRING)
    private PrayerTime prayerTime;

    @Enumerated(EnumType.STRING)
    private Gender genderTarget;

    private boolean verified;

    @ManyToOne
    @JoinColumn(name = "organizer_id")
    AccountEntity organizer;

    @ManyToMany
    @JoinTable(name = "jummahs_attendees",
            joinColumns = @JoinColumn(name = "jummah_id"),
            inverseJoinColumns = @JoinColumn(name = "account_id"))
    List<AccountEntity> attendees;

}
