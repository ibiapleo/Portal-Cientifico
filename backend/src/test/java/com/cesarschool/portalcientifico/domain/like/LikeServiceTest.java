package com.cesarschool.portalcientifico.domain.like;

import com.cesarschool.portalcientifico.domain.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.cesarschool.portalcientifico.domain.like.TargetType.MATERIAL;
import static com.cesarschool.portalcientifico.domain.like.TargetType.COMMENT;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Testes para LikeService")
class LikeServiceTest {

    @Mock
    private LikeRepository likeRepository;

    @InjectMocks
    private LikeService likeService;

    @Captor
    private ArgumentCaptor<Like> likeCaptor;

    private User user;
    private com.cesarschool.portalcientifico.domain.like.TargetType targetType;
    private Long targetId;


    @BeforeEach
    void setUp() {
        user = new User();
        user.setId("123e4567-e89b-12d3-a456-426614174000");

        targetType = MATERIAL;
        targetId = 3105L;
    }

    @Nested
    @DisplayName("Testes para o método toggleLike")
    class ToggleLikeTests {

        @Test
        @DisplayName("Deve adicionar um like quando não existe")
        void toggleLike_shouldAddLike_whenLikeDoesNotExist() {
            when(likeRepository.findByUserIdAndTarget(user.getId(), targetType, targetId))
                    .thenReturn(Optional.empty());

            boolean result = likeService.toggleLike(user, targetType, targetId);

            assertTrue(result, "O método deve retornar true indicando que o like foi adicionado.");
            verify(likeRepository).save(likeCaptor.capture());
            Like savedLike = likeCaptor.getValue();
            assertNotNull(savedLike, "Um objeto Like deve ser salvo.");
            assertEquals(user, savedLike.getUser(), "O usuário do like salvo deve ser o usuário fornecido.");
            assertEquals(targetType, savedLike.getTargetType(), "O tipo de alvo do like salvo deve ser o tipo fornecido.");
            assertEquals(targetId, savedLike.getTargetId(), "O ID do alvo do like salvo deve ser o ID fornecido.");
            assertNotNull(savedLike.getCreatedAt(), "A data de criação do like não deve ser nula.");
            verify(likeRepository, never()).delete(any(Like.class));
        }

        @Test
        @DisplayName("Deve remover um like quando já existe")
        void toggleLike_shouldRemoveLike_whenLikeExists() {
            Like existingLike = Like.builder()
                    .id(5L)
                    .user(user)
                    .targetType(targetType)
                    .targetId(targetId)
                    .createdAt(LocalDateTime.now().minusDays(1))
                    .build();
            when(likeRepository.findByUserIdAndTarget(user.getId(), targetType, targetId))
                    .thenReturn(Optional.of(existingLike));

            boolean result = likeService.toggleLike(user, targetType, targetId);

            assertFalse(result, "O método deve retornar false indicando que o like foi removido.");
            verify(likeRepository).delete(existingLike);
            verify(likeRepository, never()).save(any(Like.class));
        }
    }

    @Nested
    @DisplayName("Testes para o método countLikes")
    class CountLikesTests {

        @Test
        @DisplayName("Deve retornar a contagem correta de likes para um alvo")
        void countLikes_shouldReturnCorrectCount() {
            long expectedCount = 15L;
            when(likeRepository.countByTarget(targetType, targetId)).thenReturn(expectedCount);

            long actualCount = likeService.countLikes(targetType, targetId);

            assertEquals(expectedCount, actualCount, "A contagem de likes retornada deve ser igual à esperada.");
            verify(likeRepository).countByTarget(targetType, targetId);
        }
    }

    @Nested
    @DisplayName("Testes para o método isLikedByUser")
    class IsLikedByUserTests {

        @Test
        @DisplayName("Deve retornar true se o usuário curtiu o alvo")
        void isLikedByUser_shouldReturnTrue_whenUserLikedTarget() {
            when(likeRepository.existsByUserIdAndTarget(user.getId(), targetType, targetId)).thenReturn(true);

            boolean result = likeService.isLikedByUser(user, targetType, targetId);

            assertTrue(result, "Deve retornar true pois o repositório indica que o like existe.");
            verify(likeRepository).existsByUserIdAndTarget(user.getId(), targetType, targetId);
        }

        @Test
        @DisplayName("Deve retornar false se o usuário não curtiu o alvo")
        void isLikedByUser_shouldReturnFalse_whenUserDidNotLikeTarget() {
            when(likeRepository.existsByUserIdAndTarget(user.getId(), targetType, targetId)).thenReturn(false);

            boolean result = likeService.isLikedByUser(user, targetType, targetId);

            assertFalse(result, "Deve retornar false pois o repositório indica que o like não existe.");
            verify(likeRepository).existsByUserIdAndTarget(user.getId(), targetType, targetId);
        }
    }

    @Nested
    @DisplayName("Testes para o método countLikesByTargetIds")
    class CountLikesByTargetIdsTests {

        @Test
        @DisplayName("Deve retornar um mapa com a contagem de likes para cada ID de alvo fornecido")
        void countLikesByTargetIds_shouldReturnMapWithCounts() {
            // Given (Dado)
            List<Long> targetIds = List.of(3105L, 3106L, 3107L);
            TargetType type = MATERIAL;

            User user1 = new User(); user1.setId("123e4567-e89b-12d3-a456-426614174000");
            User user2 = new User(); user2.setId("123e4567-e89b-12d3-a456-426614174002");

            List<Like> likesFromRepo = List.of(
                    Like.builder().user(user1).targetType(type).targetId(3105L).createdAt(LocalDateTime.now()).build(),
                    Like.builder().user(user2).targetType(type).targetId(3105L).createdAt(LocalDateTime.now()).build(),
                    Like.builder().user(user1).targetType(type).targetId(3106L).createdAt(LocalDateTime.now()).build()
            );

            when(likeRepository.findByTargetTypeAndTargetIdIn(type, targetIds)).thenReturn(likesFromRepo);

            Map<Long, Long> result = likeService.countLikesByTargetIds(type, targetIds);

            assertNotNull(result, "O mapa de resultados não deve ser nulo.");
            assertEquals(2, result.size(), "O mapa deve conter entradas para os IDs com likes.");
            assertEquals(2L, result.get(3105L), "A contagem para targetId 3105L deve ser 2.");
            assertEquals(1L, result.get(3106L), "A contagem para targetId 3106L deve ser 1.");
            assertNull(result.get(3107L), "Não deve haver entrada para targetId 3107L, pois não tem likes.");
            verify(likeRepository).findByTargetTypeAndTargetIdIn(type, targetIds);
        }

        @Test
        @DisplayName("Deve retornar um mapa vazio se nenhum ID de alvo for fornecido")
        void countLikesByTargetIds_shouldReturnEmptyMap_whenNoTargetIdsProvided() {
            List<Long> targetIds = Collections.emptyList();
            TargetType type = MATERIAL;

            when(likeRepository.findByTargetTypeAndTargetIdIn(type, targetIds)).thenReturn(Collections.emptyList());

            Map<Long, Long> result = likeService.countLikesByTargetIds(type, targetIds);

            assertNotNull(result, "O mapa de resultados não deve ser nulo.");
            assertTrue(result.isEmpty(), "O mapa de resultados deve estar vazio.");
            verify(likeRepository).findByTargetTypeAndTargetIdIn(type, targetIds);
        }

        @Test
        @DisplayName("Deve retornar um mapa vazio se não houver likes para os IDs fornecidos")
        void countLikesByTargetIds_shouldReturnEmptyMap_whenNoLikesFoundForProvidedIds() {
            List<Long> targetIds = List.of(3109L, 3110L);
            TargetType type = COMMENT;

            when(likeRepository.findByTargetTypeAndTargetIdIn(type, targetIds)).thenReturn(Collections.emptyList());

            Map<Long, Long> result = likeService.countLikesByTargetIds(type, targetIds);

            assertNotNull(result, "O mapa de resultados não deve ser nulo.");
            assertTrue(result.isEmpty(), "O mapa de resultados deve estar vazio pois não há likes.");
            verify(likeRepository).findByTargetTypeAndTargetIdIn(type, targetIds);
        }
    }
}

