package com.cesarschool.portalcientifico.domain.upload;

import com.cesarschool.portalcientifico.domain.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

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
}