package com.cesarschool.portalcientifico.domain.material;

import com.cesarschool.portalcientifico.domain.comment.CommentResponseDTO;
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
