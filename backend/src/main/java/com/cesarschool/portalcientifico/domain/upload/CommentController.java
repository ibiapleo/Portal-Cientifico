package com.cesarschool.portalcientifico.domain.upload;

import com.cesarschool.portalcientifico.domain.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/materials/{id}/comments")
@RequiredArgsConstructor
@Tag(name = "Comentários", description = "Endpoints para gerenciar os comentários")
public class CommentController {

    private final CommentService commentService;

    @Operation(
            summary = "Adiciona um comentário no material",
            description = "Permite que um usuário logado e autenticado, comente em um material.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Conteúdo do Comentário",
                    required = true,
                    content = @Content(schema = @Schema(implementation = CommentRequestDTO.class))
            )
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Comentário criado com sucesso",
                    content = @Content(schema = @Schema(implementation = CommentResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição Inválida", content = @Content),
            @ApiResponse(responseCode = "404", description = "Material não encontrado", content = @Content)
    })
    @PostMapping
    public ResponseEntity<CommentResponseDTO> addComment(
            @Parameter(description = "ID do material", required = true) @PathVariable Long id,
            @Valid @RequestBody CommentRequestDTO request,
            @Parameter(hidden = true) Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        CommentResponseDTO response = commentService.addComment(id, request.getContent(), user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(
            summary = "Curtir ou descurtir um comentário",
            description = "Alterna o estado de curtida de um comentário (toggle)."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Like concluído com sucesso"),
            @ApiResponse(responseCode = "404", description = "Comentário não encontrado", content = @Content)
    })
    @PostMapping("/{commentId}/like")
    public ResponseEntity<Void> toggleLike(
            @PathVariable Long id,
            @PathVariable Long commentId,
            @Parameter(hidden = true) Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        commentService.toggleLike(commentId, user);
        return ResponseEntity.ok().build();
    }
}
