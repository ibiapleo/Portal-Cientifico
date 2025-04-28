package com.cesarschool.portalcientifico.domain.comment;

import com.cesarschool.portalcientifico.domain.comment.dto.CommentResponseDTO;
import com.cesarschool.portalcientifico.domain.material.MaterialRepository;
import com.cesarschool.portalcientifico.domain.user.User;
import com.cesarschool.portalcientifico.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final MaterialRepository materialRepository;
    private final ModelMapper mapper;

    @Transactional
    public CommentResponseDTO addComment(Long materialId, String content, User user) {
        // Verifica se o material existe
        if (!materialRepository.existsById(materialId)) {
            throw new EntityNotFoundException("Material não encontrado para o id: " + materialId);
        }

        // Cria o comentário
        Comment comment = Comment.builder()
                .materialId(materialId)
                .user(user)
                .content(content)
                .createdAt(LocalDateTime.now())
                .build();

        // Salva o comentário
        Comment saved = commentRepository.save(comment);

        // Retorna a resposta do comentário
        return CommentResponseDTO.builder()
                .id(saved.getId())
                .content(saved.getContent())
                .author(saved.getUser().getName())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    public Page<CommentResponseDTO> getCommentsByMaterialId(Long materialId, Pageable pageable) {
        return commentRepository.findByMaterialId(materialId, pageable)
                .map(comment -> {
                    CommentResponseDTO dto = mapper.map(comment, CommentResponseDTO.class);
                    dto.setAuthor(comment.getUser().getName());
                    return dto;
                });
    }

    public Optional<Comment> getCommentById(Long commentId) {
        return commentRepository.findById(commentId);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }
}
