package com.cesarschool.portalcientifico.domain.upload;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {

    boolean existsByCommentIdAndUserId(Long commentId, String userId);

    Optional<CommentLike> findByCommentIdAndUserId(Long commentId, String userId);

    void delete(Optional<CommentLike> existingLike);
}
