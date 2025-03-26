package com.cesarschool.portalcientifico.domain.upload;

import com.cesarschool.portalcientifico.domain.user.User;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
public class MaterialController {

    private final MaterialService materialService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MaterialResponseDTO> uploadMaterial(@Valid @RequestPart MaterialRequestDTO materialRequestDTO, @RequestPart("file") MultipartFile file, Authentication authentication) throws IOException {
        User user = (User) authentication.getPrincipal();
        MaterialResponseDTO materialResponse = materialService.uploadMaterial(materialRequestDTO, user, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(materialResponse);
    }
    @Operation(
            summary = "Obtém um material pelo ID",
            description = "Retorna os detalhes de um material pelo ID"
    )
    @GetMapping("/{id}")
    public MaterialResponseDTO getMaterialDetails(@PathVariable Long id) {
        return materialService.getMaterialDetails(id);
    }

    @Operation(
            summary = "Obtém todos os materiais",
            description = "Retorna os detalhes de todos os material"
    )
    @GetMapping
    public ResponseEntity<List<MaterialResponseDTO>> getAllMaterials() {
        List<MaterialResponseDTO> materials = materialService.getAllMaterials();
        return ResponseEntity.ok(materials);
    }
}