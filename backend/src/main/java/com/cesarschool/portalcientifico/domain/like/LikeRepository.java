package com.cesarschool.portalcientifico.domain.like;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {

    @Query("""
        SELECT l FROM Like l
        WHERE l.targetType = :targetType AND l.targetId = :targetId
        """)
    List<Like> findByTarget(
            @Param("targetType") TargetType targetType,
            @Param("targetId") Long targetId
    );

    @Query("""
        SELECT CASE WHEN COUNT(l) > 0 THEN true ELSE false END 
        FROM Like l 
        WHERE l.user.id = :userId 
        AND l.targetType = :targetType 
        AND l.targetId = :targetId
        """)
    boolean existsByUserIdAndTarget(
            @Param("userId") String userId,
            @Param("targetType") TargetType targetType,
            @Param("targetId") Long targetId
    );

    @Query("""
        SELECT l FROM Like l
        JOIN FETCH l.user u
        WHERE u.id = :userId AND l.targetType = :targetType AND l.targetId = :targetId
        """)
    Optional<Like> findByUserIdAndTarget(
            @Param("userId") String userId,
            @Param("targetType") TargetType targetType,
            @Param("targetId") Long targetId
    );

    @Query("""
        SELECT COUNT(l) FROM Like l
        WHERE l.targetType = :targetType AND l.targetId = :targetId
        """)
    long countByTarget(
            @Param("targetType") TargetType targetType,
            @Param("targetId") Long targetId
    );

    @Query("""
        SELECT l FROM Like l
        JOIN FETCH l.user u
        WHERE l.targetType = :type AND l.targetId in :targetIds
        """)
    List<Like> findByTargetTypeAndTargetIdIn(TargetType type, List<Long> targetIds);
}
