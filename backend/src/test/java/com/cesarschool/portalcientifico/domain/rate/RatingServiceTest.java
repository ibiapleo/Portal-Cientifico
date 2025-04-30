package com.cesarschool.portalcientifico.domain.rate;

import com.cesarschool.portalcientifico.domain.material.Material;
import com.cesarschool.portalcientifico.domain.material.MaterialRepository;
import com.cesarschool.portalcientifico.domain.rate.dto.RatingRequestDTO;
import com.cesarschool.portalcientifico.domain.user.User;
import com.cesarschool.portalcientifico.exception.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private MaterialRepository materialRepository;

    @InjectMocks
    private RatingService ratingService;

    @Test
    void givenMaterialNonExistent_whenSaveRating_thenThrowException() {
        Long materialId = 1L;
        User user = new User();
        RatingRequestDTO request = new RatingRequestDTO(5);

        when(materialRepository.findById(materialId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> ratingService.saveRating(materialId, user, request))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Material não encontrado para o id 1");

        verify(materialRepository, times(1)).findById(materialId);
        verifyNoInteractions(ratingRepository);
    }

    @Test
    void givenValidMaterialAndRating_whenSaveRating_thenSaveRatingAndUpdateMaterial() {
        Long materialId = 1L;
        User user = new User();
        RatingRequestDTO request = new RatingRequestDTO(4);
        Material material = new Material();
        material.setTotalRatings(2L);
        material.setAverageRating(3.0);

        when(materialRepository.findById(materialId)).thenReturn(Optional.of(material));

        ratingService.saveRating(materialId, user, request);

        ArgumentCaptor<Rating> ratingCaptor = ArgumentCaptor.forClass(Rating.class);
        verify(ratingRepository).save(ratingCaptor.capture());

        Rating savedRating = ratingCaptor.getValue();
        assertThat(savedRating.getMaterialId()).isEqualTo(materialId);
        assertThat(savedRating.getUser()).isEqualTo(user);
        assertThat(savedRating.getValue()).isEqualTo(4);

        assertThat(material.getTotalRatings()).isEqualTo(3);
        assertThat(material.getAverageRating()).isEqualTo((double) (3 * 2 + 4) / 3);

        verify(materialRepository).save(material);
    }

    @Test
    void givenMaterialWithNoRatings_whenSaveRating_thenAverageEqualsFirstRating() {
        Long materialId = 1L;
        User user = new User();
        RatingRequestDTO request = new RatingRequestDTO(5);
        Material material = new Material();
        material.setTotalRatings(0L);
        material.setAverageRating(0.0);

        when(materialRepository.findById(materialId)).thenReturn(Optional.of(material));

        ratingService.saveRating(materialId, user, request);

        assertThat(material.getTotalRatings()).isEqualTo(1);
        assertThat(material.getAverageRating()).isEqualTo(5.0);
    }

    @Test
    void givenExistingRatingForUserAndMaterial_whenIsRatedByUser_thenReturnTrue() {
        Long materialId = 1L;
        User user = new User();

        when(ratingRepository.existsByMaterialIdAndUser(materialId, user)).thenReturn(true);

        boolean result = ratingService.isRatedByUser(user, materialId);

        assertThat(result).isTrue();
        verify(ratingRepository).existsByMaterialIdAndUser(materialId, user);
    }

    @Test
    void givenNoExistingRatingForUserAndMaterial_whenIsRatedByUser_thenReturnFalse() {
        Long materialId = 1L;
        User user = new User();

        when(ratingRepository.existsByMaterialIdAndUser(materialId, user)).thenReturn(false);

        boolean result = ratingService.isRatedByUser(user, materialId);

        assertThat(result).isFalse();
    }
}