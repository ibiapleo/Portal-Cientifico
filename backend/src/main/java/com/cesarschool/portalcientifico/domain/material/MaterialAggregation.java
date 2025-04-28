package com.cesarschool.portalcientifico.domain.material;

import com.cesarschool.portalcientifico.domain.comment.dto.CommentResponseDTO;
import com.cesarschool.portalcientifico.domain.comment.CommentService;
import com.cesarschool.portalcientifico.domain.like.LikeService;
import com.cesarschool.portalcientifico.domain.like.TargetType;
import com.cesarschool.portalcientifico.domain.material.dto.Area;
import com.cesarschool.portalcientifico.domain.material.dto.MaterialResponseDTO;
import com.cesarschool.portalcientifico.domain.material.dto.TypeMaterial;
import com.cesarschool.portalcientifico.domain.rate.RatingService;
import com.cesarschool.portalcientifico.domain.rate.dto.RatingRequestDTO;
import com.cesarschool.portalcientifico.domain.rate.dto.RatingResponseDTO;
import com.cesarschool.portalcientifico.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
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
        RatingResponseDTO ratingStats = ratingService.getRatingStatsDetails(materialId, user);

        long likeCount = likeService.countLikes(TargetType.MATERIAL, materialId);
        boolean isLiked = likeService.isLikedByUser(user, TargetType.MATERIAL, materialId);

        material.setLiked(isLiked);
        material.setLikeCount(likeCount);

        double averageRating = ratingStats.getAverageRating();
        long totalRatings = ratingStats.getTotalRatings();
        Map<Integer, Integer> ratingDistribution = ratingStats.getDistribution();
        Integer userRating = ratingStats.getUserRating();

        material.setAverageRating(averageRating);
        material.setTotalRatings(totalRatings);
        material.setDistribution(ratingDistribution);
        material.setUserRating(userRating);

        return material;
    }

    public Page<MaterialResponseDTO> getMaterialsAggregation(
            String search,
            List<TypeMaterial> types,
            List<Area> areas,
            Integer dateRange,
            Integer minDownloads,
            Pageable pageable
    ) {
        Page<MaterialResponseDTO> materialsPage = materialService.getMaterials(
                search, types, areas, dateRange, minDownloads, pageable
        );

        List<Long> materialIds = materialsPage.getContent().stream()
                .map(MaterialResponseDTO::getId)
                .toList();

        Map<Long, RatingResponseDTO> ratingsMap = ratingService.getRatingStats(materialIds);

        List<MaterialResponseDTO> enrichedMaterials = materialsPage.getContent().stream()
                .map(material -> {
                    RatingResponseDTO rating = ratingsMap.get(material.getId());
                    if (rating != null) {
                        material.setAverageRating(rating.getAverageRating());
                        material.setTotalRatings(rating.getTotalRatings());
                        material.setDistribution(rating.getDistribution());
                    }
                    return material;
                })
                .toList();

        return new PageImpl<>(
                enrichedMaterials,
                pageable,
                materialsPage.getTotalElements()
        );
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

    public RatingResponseDTO saveRatingToMaterial(Long materialId, User user, RatingRequestDTO request) {
        return ratingService.saveRating(materialId, user, request);
    }

    public RatingResponseDTO getRatingStatsToMaterial(Long materialId, User user) {
        return ratingService.getRatingStatsDetails(materialId, user);
    }

}
