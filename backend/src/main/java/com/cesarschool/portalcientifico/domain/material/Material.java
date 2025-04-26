package com.cesarschool.portalcientifico.domain.material;

import com.cesarschool.portalcientifico.domain.comment.Comment;
import com.cesarschool.portalcientifico.domain.material.dto.Area;
import com.cesarschool.portalcientifico.domain.material.dto.TypeMaterial;
import com.cesarschool.portalcientifico.domain.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "materials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TypeMaterial type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Area area;

    @ElementCollection
    private List<String> keywords;

    @Column(nullable = false)
    private String fileName;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "total_download", columnDefinition = "integer default 0")
    private int totalDownload;

    @Column(name = "total_view", columnDefinition = "integer default 0")
    private int totalView;

    @Column(name = "file_size")
    private String fileSize;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "upload_date", columnDefinition = "timestamp default now()")
    private LocalDateTime uploadDate;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "update_at", nullable = false)
    private LocalDateTime updateAt;

    @OneToMany(mappedBy = "materialId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();
}
