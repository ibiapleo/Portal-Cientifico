package com.cesarschool.portalcientifico.domain.upload;

import com.cesarschool.portalcientifico.domain.user.User;
import com.cesarschool.portalcientifico.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final CommentLikeRepository likeRepository;
    private final MaterialRepository materialRepository;

    @Transactional
    public CommentResponseDTO addComment(Long id, String content, User user) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Material não encontrado para o id: " + id));

        Comment comment = Comment.builder()
                .material(material)
                .author(user)
                .content(content)
                .createdAt(LocalDateTime.now())
                .build();

        Comment saved = commentRepository.save(comment);

        return CommentResponseDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(comment.getAuthor().getName())
                .createdAt(comment.getCreatedAt())
                .likes(comment.getLikes().size())
                .build();
    }

    @Transactional
    public void toggleLike(Long commentId, User user) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comentário não encontrado para o id: " + commentId));

        Optional<CommentLike> existingLike = likeRepository.findByCommentIdAndUserId(commentId, user.getId());

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
        } else {
            CommentLike newLike = CommentLike.builder()
                    .comment(comment)
                    .user(user)
                    .build();

            likeRepository.save(newLike);
        }
    }
}
