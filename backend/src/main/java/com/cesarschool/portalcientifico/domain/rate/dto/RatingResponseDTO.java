package com.cesarschool.portalcientifico.domain.rate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RatingResponseDTO {
    private double averageRating;
    private long totalRatings;
    private Map<Integer, Integer> distribution;
    private Integer userRating;
}