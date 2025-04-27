package com.cesarschool.portalcientifico.domain.material;

import com.cesarschool.portalcientifico.domain.material.dto.Area;
import com.cesarschool.portalcientifico.domain.material.dto.TypeMaterial;
import com.cesarschool.portalcientifico.domain.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MaterialRepository extends JpaRepository<Material, Long> {

    @Query("""
        SELECT m FROM Material m
        JOIN FETCH m.user user
        LEFT JOIN FETCH m.keywords keywords
        LEFT JOIN FETCH m.comments comments
        WHERE m.user = :user
        """)
    Page<Material> findByUser(User user, Pageable pageable);

    @Query("""
        SELECT m FROM Material m
        JOIN FETCH m.user user
        LEFT JOIN FETCH m.keywords keywords
        LEFT JOIN FETCH m.comments comments
        WHERE (:search       IS NULL
               OR LOWER(m.title)       LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(m.description) LIKE LOWER(CONCAT('%', :search, '%')))
          AND (:types        IS NULL OR m.type IN :types)
          AND (:areas        IS NULL OR m.area IN :areas)
          AND m.createdAt >= :pastDate
          AND (:minDownloads IS NULL OR m.totalDownload >= :minDownloads)
        """)
    Page<Material> findByFilters(
            @Param("search")       String search,
            @Param("types")        List<TypeMaterial> types,
            @Param("areas")        List<Area> areas,
            @Param("pastDate") LocalDateTime pastDate,
            @Param("minDownloads") Integer minDownloads,
            Pageable pageable
    );

    @Query(""" 
            SELECT m FROM Material m
            JOIN FETCH m.user user
            LEFT JOIN FETCH m.keywords keywords
            LEFT JOIN FETCH m.comments comments
            WHERE m.area IN :areas
           """)
    Page<Material> findByAreaIn(List<Area> areas, Pageable pageable);

    @Query(""" 
            SELECT m FROM Material m
            JOIN FETCH m.user user
            LEFT JOIN FETCH m.keywords keywords
            LEFT JOIN FETCH m.comments comments
            ORDER BY m.totalDownload DESC
           """)
    Page<Material> findAllByOrderByTotalDownloadDesc(Pageable pageable);

    @Query("SELECT k FROM Material m JOIN m.keywords k GROUP BY k ORDER BY COUNT(k) DESC")
    List<String> findTopTrendingTags(Pageable pageable);

    @Query(""" 
            SELECT m FROM Material m
            JOIN FETCH m.user user
            LEFT JOIN FETCH m.keywords keywords
            LEFT JOIN FETCH m.comments comments
            WHERE m.id = :id
           """)
    Optional<Material> findByIdWithJoin(Long id);
}
