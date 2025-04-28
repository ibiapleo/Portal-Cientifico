package com.cesarschool.portalcientifico.domain.rate;

import com.cesarschool.portalcientifico.domain.material.MaterialRepository;
import com.cesarschool.portalcientifico.domain.rate.dto.RatingRequestDTO;
import com.cesarschool.portalcientifico.domain.rate.dto.RatingResponseDTO;
import com.cesarschool.portalcientifico.domain.user.User;
import com.cesarschool.portalcientifico.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MaterialRepository materialRepository;

    public RatingResponseDTO saveRating(Long materialId, User user, RatingRequestDTO request) {
        if (!materialRepository.existsById(materialId)) {
            throw new EntityNotFoundException("Material não encontrado para o id: " + materialId);
        }

        Rating existingRating = ratingRepository.findByMaterialAndUser(materialId, user.getId())
                .orElse(null);

        if (existingRating != null) {
            existingRating.setValue(request.getValue());
        } else {
            existingRating = Rating.builder()
                    .materialId(materialId)
                    .user(user)
                    .value(request.getValue())
                    .build();
        }

        ratingRepository.save(existingRating);
        return getRatingStatsDetails(materialId, user);
    }

    public RatingResponseDTO getRatingStatsDetails(Long materialId, User user) {
        RatingResponseDTO stats = calculateRatingStats(materialId);

        return ratingRepository.findByMaterialAndUser(materialId, user.getId())
                .map(rating -> RatingResponseDTO.builder()
                        .averageRating(stats.getAverageRating())
                        .totalRatings(stats.getTotalRatings())
                        .distribution(stats.getDistribution())
                        .userRating(rating.getValue())
                        .build()
                )
                .orElseGet(() -> RatingResponseDTO.builder()
                        .averageRating(stats.getAverageRating())
                        .totalRatings(stats.getTotalRatings())
                        .distribution(stats.getDistribution())
                        .userRating(null)
                        .build()
                );
    }

    public Map<Long, RatingResponseDTO> getRatingStats(List<Long> materialIds) {
        List<Rating> ratings = ratingRepository.findAll(materialIds);

        return ratings.stream()
                .collect(Collectors.groupingBy(
                        Rating::getMaterialId,
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> {
                                    double avg = list.stream()
                                            .mapToInt(Rating::getValue)
                                            .average()
                                            .orElse(0.0);

                                    Map<Integer, Integer> dist = list.stream()
                                            .collect(Collectors.groupingBy(
                                                    Rating::getValue,
                                                    Collectors.summingInt(e -> 1)
                                            ));

                                    return RatingResponseDTO.builder()
                                            .averageRating(avg)
                                            .totalRatings(list.size())
                                            .distribution(dist)
                                            .build();
                                }
                        )
                ));
    }


    private RatingResponseDTO calculateRatingStats(Long materialId) {
        List<Rating> ratings = ratingRepository.findAllByMaterialId(materialId);

        if (ratings.isEmpty()) {
            return RatingResponseDTO.builder()
                    .averageRating(0.0)
                    .totalRatings(0)
                    .distribution(Map.of(1, 0, 2, 0, 3, 0, 4, 0, 5, 0))
                    .build();
        }

        int total = ratings.size();
        double sum = ratings.stream().mapToInt(Rating::getValue).sum();
        Map<Integer, Integer> distribution = new HashMap<>(Map.of(1, 0, 2, 0, 3, 0, 4, 0, 5, 0));

        ratings.forEach(r -> distribution.merge(r.getValue(), 1, Integer::sum));

        return RatingResponseDTO.builder()
                .averageRating(Math.round((sum / total) * 10.0) / 10.0) // Arredonda para 1 decimal
                .totalRatings(total)
                .distribution(distribution)
                .build();
    }
}