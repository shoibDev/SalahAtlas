package com.islam.backend.domain.entities;


import com.islam.backend.domain.entities.value.Geolocation;
import com.islam.backend.enums.Gender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "accounts")
@EntityListeners(AuditingEntityListener.class)
public class AccountEntity{

    @Id
    @GeneratedValue
    private UUID id;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @CreatedDate
    private LocalDateTime createdAt;

    @Embedded
    private Geolocation geolocation;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean verified;

    @ManyToMany(mappedBy = "attendees", fetch = FetchType.LAZY)
    private List<JummahEntity> attendingJummahs;

}
