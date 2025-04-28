package com.cesarschool.portalcientifico.domain.rate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    @Query(value = """
        SELECT r FROM Rating r
        WHERE r.materialId = :materialId AND r.user.id = :userId
    """)
    Optional<Rating> findByMaterialAndUser(
            @Param("materialId") Long materialId,
            @Param("userId") String userId
    );

    @Query("""
        SELECT r FROM Rating r
        WHERE r.materialId = :materialId
    """)
    List<Rating> findAllByMaterialId(@Param("materialId") Long materialId);

    @Query("""
    SELECT r FROM Rating r WHERE r.materialId IN :materialIds
    """)
    List<Rating> findAll(@Param("materialIds") List<Long> materialIds);
}