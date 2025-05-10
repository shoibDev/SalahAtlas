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
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "jummahs")
@EntityListeners(AuditingEntityListener.class)
public class JummahEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime time;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender genderTarget;

    @Embedded
    private Geolocation geolocation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PrayerTime prayerTime;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "organizer_id")
    AccountEntity organizer;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "jummahs_attendees",
            joinColumns = @JoinColumn(name = "jummah_id"),
            inverseJoinColumns = @JoinColumn(name = "account_id"))
    List<AccountEntity> attendees;

    @PrePersist
    public void prePersist() {
        if (date == null) {
            date = LocalDate.now();
        }
    }

}
