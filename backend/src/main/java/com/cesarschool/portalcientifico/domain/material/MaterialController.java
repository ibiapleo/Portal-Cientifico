package com.cesarschool.portalcientifico.domain.material;

import com.cesarschool.portalcientifico.domain.comment.dto.CommentRequestDTO;
import com.cesarschool.portalcientifico.domain.comment.dto.CommentResponseDTO;
import com.cesarschool.portalcientifico.domain.material.dto.*;
import com.cesarschool.portalcientifico.domain.rate.dto.RatingRequestDTO;
import com.cesarschool.portalcientifico.domain.rate.dto.RatingResponseDTO;
import com.cesarschool.portalcientifico.domain.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/v1/materials")
@RequiredArgsConstructor
@Tag(name = "Materiais", description = "Endpoints para gerenciamento de materiais")
public class MaterialController {

    private final MaterialService materialService;
    private final MaterialAggregation materialAggregation;

    @Operation(
            summary = "Faz o upload de um material",
            description = "Permite que um usuário envie um material com seus metadados e um arquivo.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Dados do material e arquivo a ser enviado",
                    required = true,
                    content = @Content(
                            mediaType = MediaType.MULTIPART_FORM_DATA_VALUE
                    )
            )
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Material criado com sucesso",
                    content = @Content(schema = @Schema(implementation = MaterialResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor", content = @Content)
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MaterialResponseDTO> uploadMaterial(
            @Valid @RequestPart MaterialRequestDTO materialRequestDTO,
            @RequestPart("file") @Schema(type = "string", format = "binary")  MultipartFile file,
            @Parameter(hidden = true) Authentication authentication
    ) throws IOException {
        User user = (User) authentication.getPrincipal();
        MaterialResponseDTO materialResponse = materialService.uploadMaterial(materialRequestDTO, user, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(materialResponse);
    }

    @Operation(
            summary = "Obtém um material pelo ID",
            description = "Retorna os detalhes de um material existente a partir de seu ID."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Material encontrado com sucesso",
                    content = @Content(schema = @Schema(implementation = MaterialResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Material não encontrado", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<MaterialResponseDTO> getMaterialDetails(
            @Parameter(description = "ID do material", required = true) @PathVariable Long id,
            @Parameter Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        MaterialResponseDTO materialResponse = materialAggregation.getMaterialAggregation(id, user);
        return ResponseEntity.status(HttpStatus.OK).body(materialResponse);
    }

    @GetMapping("/me")
    @Operation(
            summary = "Obtém todos os materiais do usuário logado (paginado)",
            description = "Retorna a lista paginada de materiais cadastrados pelo usuário autenticado."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Materiais obtidos com sucesso",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = MaterialResponseDTO.class))))
    })
    public ResponseEntity<Page<MaterialResponseDTO>> getAllMaterials(
            @Parameter Authentication authentication,
            @ParameterObject Pageable pageable
    ) {
        User user = (User) authentication.getPrincipal();
        Page<MaterialResponseDTO> materials = materialService.getAllMaterialsByUser(user, pageable);
        return ResponseEntity.ok(materials);
    }

    @Operation(
            summary = "Gera uma URL temporária para download do material",
            description = "Retorna uma URL temporária (presigned) para download direto do S3."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "URL gerada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Material não encontrado")
    })
    @GetMapping("/{id}/download")
    public ResponseEntity<DownloadUrlResponse> generateDownloadUrl(@PathVariable Long id) {
        return ResponseEntity.ok(materialService.getFileNameByMaterialId(id));
    }

    @GetMapping
    public ResponseEntity<Page<MaterialResponseDTO>> getMaterials(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<TypeMaterial> type,
            @RequestParam(required = false) List<Area> area,
            @RequestParam(required = false) Integer dateRange,
            @RequestParam(required = false) Integer minDownloads,
            Pageable pageable
    ) {
        Page<MaterialResponseDTO> page = materialService.getMaterials(search, type, area, dateRange, minDownloads, pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/recommended")
    public ResponseEntity<Page<MaterialResponseDTO>> getRecommendedMaterials(
            @Parameter Authentication authentication,
            Pageable pageable
    ) {
        User user = (User) authentication.getPrincipal();
        Page<MaterialResponseDTO> result = materialService.getRecommendedMaterials(user, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/trending-topics")
    public ResponseEntity<List<String>> getTrendingTopics() {
        List<String> topics = materialService.getTrendingTopics();
        return ResponseEntity.ok(topics);
    }

    @GetMapping("/trending")
    public ResponseEntity<Page<MaterialResponseDTO>> getTrendingMaterials(Pageable pageable) {
        Page<MaterialResponseDTO> result = materialService.getTrendingMaterials(pageable);
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Obtém todos os dados de um material",
            description = "Retorna os dados do material, quantidade de curtidas, se o usuário curtiu e comentários."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Dados agregados obtidos com sucesso",
                    content = @Content(schema = @Schema(implementation = AggregationDTO.class))),
            @ApiResponse(responseCode = "404", description = "Material não encontrado", content = @Content)
    })
    @GetMapping("/{id}/comments")
    public ResponseEntity<Page<CommentResponseDTO>> getCommentsByMaterial(
            @Parameter(description = "ID do material", required = true) @PathVariable Long id,
            Pageable pageable
    ) {
        return ResponseEntity.ok(materialAggregation.getCommentsByMaterialId(id, pageable));
    }

    @Operation(
            summary = "Alterna o like de um material",
            description = "Permite que um usuário logado curta ou descurta um material."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Like atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Material não encontrado")
    })
    @PostMapping("/{id}/like")
    public ResponseEntity<Boolean> toggleLikeForMaterial(
            @Parameter(description = "ID do material", required = true) @PathVariable Long id,
            @Parameter(hidden = true) Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        boolean liked = materialAggregation.toggleLikeForMaterial(id, user);
        return ResponseEntity.ok(liked);
    }

    @Operation(
            summary = "Alterna o like de um comentário",
            description = "Permite que um usuário logado curta ou descurta um comentário de um material."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Like atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Comentário ou Material não encontrado")
    })
    @PostMapping("/{materialId}/comments/{commentId}/like")
    public ResponseEntity<Boolean> toggleLikeForComment(
            @Parameter(description = "ID do material", required = true) @PathVariable Long materialId,
            @Parameter(description = "ID do comentário", required = true) @PathVariable Long commentId,
            @Parameter(hidden = true) Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        boolean liked = materialAggregation.toggleLikeForComment(materialId, commentId, user);
        return ResponseEntity.ok(liked);
    }

    @Operation(
            summary = "Adiciona um comentário",
            description = "Permite que um usuário logado comente um material."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comentário adicionado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Material não encontrado")
    })
    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponseDTO> addComment(
            @Parameter(description = "ID do material", required = true) @PathVariable Long id,
            @RequestBody CommentRequestDTO commentRequest,
            @Parameter(hidden = true) Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        String content = commentRequest.getContent();
        CommentResponseDTO response = materialAggregation.addCommentToMaterial(id, content, user);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Deleta um material",
            description = "Permite que um usuário logado delete um material que ele mesmo enviou."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Material deletado com sucesso"),
            @ApiResponse(responseCode = "403", description = "Usuário não autorizado a deletar este material"),
            @ApiResponse(responseCode = "404", description = "Material não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(
            @Parameter(description = "ID do material", required = true) @PathVariable Long id,
            @Parameter(hidden = true) Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        materialService.deleteMaterial(id, user);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Avalia um material",
            description = "Permite que um usuário avalie um material com estrelas de 1 a 5"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Avaliação registrada com sucesso",
                    content = @Content(schema = @Schema(implementation = RatingResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Avaliação inválida", content = @Content),
            @ApiResponse(responseCode = "404", description = "Material não encontrado", content = @Content)
    })
    @PostMapping("/{id}/rate")
    public ResponseEntity<Integer> rateMaterial(
            @Parameter(description = "ID do material", required = true) @PathVariable Long id,
            @Valid @RequestBody RatingRequestDTO request,
            @Parameter(hidden = true) Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        Integer rated = materialAggregation.saveRatingToMaterial(id, user, request);
        return ResponseEntity.ok(rated);
    }

}
