package com.cesarschool.portalcientifico.domain.comment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query(value = """
        SELECT c FROM Comment c
        JOIN FETCH c.user
        WHERE c.materialId = :materialId
        ORDER BY c.createdAt DESC
    """)
    Page<Comment> findByMaterialId(Long materialId, Pageable pageable);
}
