package com.cesarschool.portalcientifico.domain.upload;

import com.cesarschool.portalcientifico.domain.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, Long> {

    Page<Material> findByUser(User user, Pageable pageable);

    @Query("""
        SELECT m FROM Material m
        JOIN FETCH m.user user
        JOIN FETCH m.keywords keywords
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

    Page<Material> findByAreaIn(List<Area> areas, Pageable pageable);
    Page<Material> findAllByOrderByTotalDownloadDesc(Pageable pageable);

    @Query("SELECT k FROM Material m JOIN m.keywords k GROUP BY k ORDER BY COUNT(k) DESC")
    List<String> findTopTrendingTags(Pageable pageable);
}
