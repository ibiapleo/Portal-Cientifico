package com.cesarschool.portalcientifico.domain.material;

import com.cesarschool.portalcientifico.domain.comment.dto.CommentResponseDTO;
import com.cesarschool.portalcientifico.domain.comment.CommentService;
import com.cesarschool.portalcientifico.domain.like.LikeService;
import com.cesarschool.portalcientifico.domain.like.TargetType;
import com.cesarschool.portalcientifico.domain.material.dto.MaterialResponseDTO;
import com.cesarschool.portalcientifico.domain.rate.Rating;
import com.cesarschool.portalcientifico.domain.rate.RatingService;
import com.cesarschool.portalcientifico.domain.rate.dto.RatingRequestDTO;
import com.cesarschool.portalcientifico.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaterialAggregation {

    private final MaterialService materialService;
    private final LikeService likeService;
    private final CommentService commentService;
    private final RatingService ratingService;

    public MaterialResponseDTO getMaterialAggregation(Long materialId, User user) {
        MaterialResponseDTO material = materialService.getMaterialDetails(materialId);

        long likeCount = likeService.countLikes(TargetType.MATERIAL, materialId);
        boolean isLiked = likeService.isLikedByUser(user, TargetType.MATERIAL, materialId);
        Optional<Integer> userRating = ratingService.isRatedByUser(user, materialId);

        material.setLiked(isLiked);
        material.setLikeCount(likeCount);
        material.setUserRating(userRating);

        return material;
    }

    public Page<CommentResponseDTO> getCommentsByMaterialId(Long materialId, Pageable pageable) {
        Page<CommentResponseDTO> commentsPage = commentService.getCommentsByMaterialId(materialId, pageable);

        List<Long> commentIds = commentsPage.stream()
                .map(CommentResponseDTO::getId)
                .collect(Collectors.toList());

        Map<Long, Long> likeCounts = likeService.countLikesByTargetIds(TargetType.COMMENT, commentIds);

        List<CommentResponseDTO> updatedComments = commentsPage.stream()
                .peek(comment -> comment.setLikes(likeCounts.getOrDefault(comment.getId(), 0L)))
                .collect(Collectors.toList());

        return new PageImpl<>(updatedComments, pageable, commentsPage.getTotalElements());
    }

    public CommentResponseDTO addCommentToMaterial(Long materialId, String content, User user) {
        return commentService.addComment(materialId, content, user);
    }

    public boolean toggleLikeForMaterial(Long materialId, User user) {
        return likeService.toggleLike(user, TargetType.MATERIAL, materialId);
    }

    public boolean toggleLikeForComment(Long commentId, Long id, User user) {
        return likeService.toggleLike(user, TargetType.COMMENT, commentId);
    }

    public Integer saveRatingToMaterial(Long materialId, User user, RatingRequestDTO request) {
        ratingService.saveRating(materialId, user, request);
        return request.getValue();
    }

}
