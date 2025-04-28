package com.cesarschool.portalcientifico.domain.material;

import com.cesarschool.portalcientifico.domain.comment.dto.CommentResponseDTO;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AggregationDTO {
    private Long materialId;
    private String materialTitle;
    private long likeCount;
    private boolean isLiked;
    private List<CommentResponseDTO> comments;
}
