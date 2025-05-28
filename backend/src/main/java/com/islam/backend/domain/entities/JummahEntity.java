package com.islam.backend.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @PrePersist
    public void prePersist() {
        if (date == null) {
            date = LocalDate.now();
        }
    }

    @Id
    @GeneratedValue
    private UUID id;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime time;

    @Embedded
    private Geolocation geolocation;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    private PrayerTime prayerTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender genderTarget;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", referencedColumnName = "id")
    AccountEntity organizer;

    @ManyToMany
    @JoinTable(name = "jummahs_attendees",
            joinColumns = @JoinColumn(name = "jummah_id"),
            inverseJoinColumns = @JoinColumn(name = "account_id"))
    List<AccountEntity> attendees;

    @OneToMany(mappedBy = "jummah", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ChatMessageEntity> messages;

}
