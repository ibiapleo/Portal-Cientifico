package com.cesarschool.portalcientifico.domain.comment;

import com.cesarschool.portalcientifico.domain.comment.dto.CommentResponseDTO;
import com.cesarschool.portalcientifico.domain.material.MaterialRepository;
import com.cesarschool.portalcientifico.domain.user.User;
import com.cesarschool.portalcientifico.exception.EntityNotFoundException;
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
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Testes para CommentService")
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private MaterialRepository materialRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private CommentService commentService;

    @Captor
    private ArgumentCaptor<Comment> commentCaptor;

    private User user;
    private Long materialId;
    private Long commentId;
    private String commentContent;
    private Pageable pageable;
    private LocalDateTime fixedTime;

    @BeforeEach
    void setUp() {
        this.user = new User();
        this.user.setId("123e4567-e89b-12d3-a456-426614174002");
        this.user.setName("Test User");

        materialId = 100L;
        commentId = 1L;
        commentContent = "Este é um comentário de teste.";
        pageable = PageRequest.of(0, 10);
        fixedTime = LocalDateTime.now();
    }

    @Nested
    @DisplayName("Testes para o método addComment")
    class AddCommentTests {

        @Test
        @DisplayName("Deve adicionar um comentário com sucesso quando o material existe")
        void addComment_shouldSucceed_whenMaterialExists() {
            when(materialRepository.existsById(materialId)).thenReturn(true);

            Comment commentToSave = Comment.builder()
                    .materialId(materialId)
                    .user(user)
                    .content(commentContent)
                    .build();

            Comment savedComment = Comment.builder()
                    .id(commentId)
                    .materialId(materialId)
                    .user(user)
                    .content(commentContent)
                    .createdAt(fixedTime)
                    .build();

            when(commentRepository.save(any(Comment.class))).thenReturn(savedComment);

            CommentResponseDTO result = commentService.addComment(materialId, commentContent, user);

            assertNotNull(result, "O DTO de resposta não deve ser nulo.");
            assertEquals(commentId, result.getId(), "O ID do DTO deve ser o mesmo do comentário salvo.");
            assertEquals(commentContent, result.getContent(), "O conteúdo do DTO deve ser o mesmo do comentário salvo.");
            assertEquals(user.getName(), result.getAuthor(), "O autor no DTO deve ser o nome do usuário.");
            assertEquals(fixedTime, result.getCreatedAt(), "A data de criação no DTO deve ser a mesma do comentário salvo.");

            verify(materialRepository).existsById(materialId);
            verify(commentRepository).save(commentCaptor.capture());
            Comment capturedComment = commentCaptor.getValue();
            assertEquals(materialId, capturedComment.getMaterialId(), "O materialId do comentário capturado deve ser o correto.");
            assertEquals(user, capturedComment.getUser(), "O usuário do comentário capturado deve ser o correto.");
            assertEquals(commentContent, capturedComment.getContent(), "O conteúdo do comentário capturado deve ser o correto.");
            assertNotNull(capturedComment.getCreatedAt(), "A data de criação do comentário capturado não deve ser nula.");
        }

        @Test
        @DisplayName("Deve lançar EntityNotFoundException quando o material não existe")
        void addComment_shouldThrowEntityNotFoundException_whenMaterialDoesNotExist() {
            when(materialRepository.existsById(materialId)).thenReturn(false);

            EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
                commentService.addComment(materialId, commentContent, user);
            }, "Deve lançar EntityNotFoundException se o material não for encontrado.");

            assertTrue(exception.getMessage().contains(String.valueOf(materialId)), "A mensagem de exceção deve conter o ID do material.");

            verify(materialRepository).existsById(materialId);
            verify(commentRepository, never()).save(any(Comment.class));
        }
    }

    @Nested
    @DisplayName("Testes para o método getCommentsByMaterialId")
    class GetCommentsByMaterialIdTests {

        @Test
        @DisplayName("Deve retornar uma página de DTOs de comentários quando existem comentários")
        void getCommentsByMaterialId_shouldReturnPageOfDTOs_whenCommentsExist() {
            Comment comment1 = Comment.builder().id(1L).user(user).content("Comentário 1").createdAt(fixedTime).build();
            Comment comment2 = Comment.builder().id(2L).user(user).content("Comentário 2").createdAt(fixedTime.minusHours(1)).build();
            List<Comment> commentList = List.of(comment1, comment2);
            Page<Comment> commentPage = new PageImpl<>(commentList, pageable, commentList.size());

            when(commentRepository.findByMaterialId(materialId, pageable)).thenReturn(commentPage);

            CommentResponseDTO dto1 = CommentResponseDTO.builder().id(1L).content("Comentário 1").createdAt(fixedTime).build();
            CommentResponseDTO dto2 = CommentResponseDTO.builder().id(2L).content("Comentário 2").createdAt(fixedTime.minusHours(1)).build();

            when(modelMapper.map(comment1, CommentResponseDTO.class)).thenReturn(dto1);
            when(modelMapper.map(comment2, CommentResponseDTO.class)).thenReturn(dto2);

            Page<CommentResponseDTO> resultPage = commentService.getCommentsByMaterialId(materialId, pageable);

            assertNotNull(resultPage, "A página de resultados não deve ser nula.");
            assertEquals(2, resultPage.getTotalElements(), "O número total de elementos deve ser 2.");
            assertEquals(2, resultPage.getContent().size(), "O conteúdo da página deve ter 2 DTOs.");

            CommentResponseDTO resultDto1 = resultPage.getContent().getFirst();
            assertEquals(dto1.getId(), resultDto1.getId());
            assertEquals(dto1.getContent(), resultDto1.getContent());
            assertEquals(user.getName(), resultDto1.getAuthor(), "O autor do DTO1 deve ser o nome do usuário.");
            assertEquals(dto1.getCreatedAt(), resultDto1.getCreatedAt());

            CommentResponseDTO resultDto2 = resultPage.getContent().get(1);
            assertEquals(dto2.getId(), resultDto2.getId());
            assertEquals(dto2.getContent(), resultDto2.getContent());
            assertEquals(user.getName(), resultDto2.getAuthor(), "O autor do DTO2 deve ser o nome do usuário.");
            assertEquals(dto2.getCreatedAt(), resultDto2.getCreatedAt());

            verify(commentRepository).findByMaterialId(materialId, pageable);
            verify(modelMapper, times(2)).map(any(Comment.class), eq(CommentResponseDTO.class));
        }

        @Test
        @DisplayName("Deve retornar uma página vazia quando não existem comentários para o material")
        void getCommentsByMaterialId_shouldReturnEmptyPage_whenNoCommentsExist() {
            Page<Comment> emptyPage = new PageImpl<>(Collections.emptyList(), pageable, 0);
            when(commentRepository.findByMaterialId(materialId, pageable)).thenReturn(emptyPage);

            Page<CommentResponseDTO> resultPage = commentService.getCommentsByMaterialId(materialId, pageable);

            assertNotNull(resultPage, "A página de resultados não deve ser nula.");
            assertTrue(resultPage.isEmpty(), "A página de resultados deve estar vazia.");
            assertEquals(0, resultPage.getTotalElements(), "O número total de elementos deve ser 0.");

            verify(commentRepository).findByMaterialId(materialId, pageable);
            verify(modelMapper, never()).map(any(), any());
        }
    }

    @Nested
    @DisplayName("Testes para o método getCommentById")
    class GetCommentByIdTests {

        @Test
        @DisplayName("Deve retornar Optional com comentário quando o comentário existe")
        void getCommentById_shouldReturnOptionalWithComment_whenCommentExists() {
            Comment existingComment = Comment.builder()
                    .id(commentId)
                    .materialId(materialId)
                    .user(user)
                    .content(commentContent)
                    .createdAt(fixedTime)
                    .build();
            when(commentRepository.findById(commentId)).thenReturn(Optional.of(existingComment));

            Optional<Comment> result = commentService.getCommentById(commentId);

            assertTrue(result.isPresent(), "O Optional retornado deve conter um comentário.");
            assertEquals(existingComment, result.get(), "O comentário retornado deve ser o esperado.");
            verify(commentRepository).findById(commentId);
        }

        @Test
        @DisplayName("Deve retornar Optional vazio quando o comentário não existe")
        void getCommentById_shouldReturnEmptyOptional_whenCommentDoesNotExist() {
            when(commentRepository.findById(commentId)).thenReturn(Optional.empty());

            Optional<Comment> result = commentService.getCommentById(commentId);

            assertTrue(result.isEmpty(), "O Optional retornado deve estar vazio.");
            verify(commentRepository).findById(commentId);
        }
    }

    @Nested
    @DisplayName("Testes para o método deleteComment")
    class DeleteCommentTests {

        @Test
        @DisplayName("Deve chamar deleteById no repositório com o ID correto")
        void deleteComment_shouldCallRepositoryDeleteById() {
            doNothing().when(commentRepository).deleteById(commentId);

            commentService.deleteComment(commentId);

            verify(commentRepository).deleteById(commentId);
        }
    }
}

