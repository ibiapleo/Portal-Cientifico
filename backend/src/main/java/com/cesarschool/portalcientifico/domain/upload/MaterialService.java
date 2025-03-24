package com.cesarschool.portalcientifico.domain.upload;

import com.cesarschool.portalcientifico.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final S3Service s3Service;
    private final ModelMapper modelMapper;

    @Transactional
    public MaterialResponseDTO uploadMaterial(MaterialRequestDTO materialRequestDTO, User user, MultipartFile file) throws IOException {

        var filename = s3Service.uploadFile(file);

        Material material = Material.builder()
                .title(materialRequestDTO.getTitle())
                .description(materialRequestDTO.getDescription())
                .type(materialRequestDTO.getType())
                .discipline(materialRequestDTO.getDiscipline())
                .knowledgeArea(materialRequestDTO.getKnowledgeArea())
                .keywords(materialRequestDTO.getKeywords())
                .fileName(filename)
                .user(user)
                .uploadDate(LocalDateTime.now())
                .creationDate(LocalDateTime.now())
                .build();

        materialRepository.save(material);
        return modelMapper.map(material, MaterialResponseDTO.class);
    }
}