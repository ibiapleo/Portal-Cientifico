package com.cesarschool.portalcientifico.domain.rate;

import com.cesarschool.portalcientifico.domain.material.MaterialRepository;
import com.cesarschool.portalcientifico.domain.rate.dto.RatingRequestDTO;
import com.cesarschool.portalcientifico.domain.user.User;
import com.cesarschool.portalcientifico.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MaterialRepository materialRepository;

    @Transactional
    public void saveRating(Long materialId, User user, RatingRequestDTO request) {
        var material = materialRepository.findById(materialId)
                .orElseThrow(() -> new EntityNotFoundException("Material não encontrado para o id " + materialId));

        long totalRatings = material.getTotalRatings();
        double averageRating = material.getAverageRating();

        var newRating = Rating.builder()
                    .materialId(materialId)
                    .user(user)
                    .value(request.getValue())
                    .build();

        ratingRepository.save(newRating);

        material.setTotalRatings(material.getTotalRatings() + 1);
        double newAverage = (averageRating * totalRatings + request.getValue()) / (totalRatings + 1);
        material.setAverageRating(newAverage);

        materialRepository.save(material);
    }

    public boolean isRatedByUser(User user, Long materialId) {
        return ratingRepository.existsByMaterialIdAndUser(materialId, user);
    }

}