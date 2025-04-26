package com.cesarschool.portalcientifico.domain.user;

import com.cesarschool.portalcientifico.domain.material.dto.Area;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column
    private String photoUrl;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime lastActivity;

    @Column(length = 500)
    private String refreshToken;

    @ElementCollection(targetClass = Area.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "user_preferred_areas", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "area")
    private List<Area> preferredAreas;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.lastActivity = LocalDateTime.now();
    }

}
