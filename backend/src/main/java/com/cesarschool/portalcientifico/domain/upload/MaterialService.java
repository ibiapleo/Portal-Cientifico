package com.cesarschool.portalcientifico.domain.upload;

import com.cesarschool.portalcientifico.domain.user.User;
import com.cesarschool.portalcientifico.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final S3Service s3Service;
    private final ModelMapper mapper;

    @Transactional
    public MaterialResponseDTO uploadMaterial(MaterialRequestDTO materialRequestDTO, User user, MultipartFile file) throws IOException {

        var filename = s3Service.uploadFile(file);

        Material material = Material.builder()
                .title(materialRequestDTO.getTitle())
                .description(materialRequestDTO.getDescription())
                .type(materialRequestDTO.getType())
                .area(materialRequestDTO.getArea())
                .keywords(materialRequestDTO.getKeywords())
                .fileName(filename)
                .user(user)
                .uploadDate(LocalDateTime.now())
                .creationDate(LocalDateTime.now())
                .build();

        materialRepository.save(material);
        return mapper.map(material, MaterialResponseDTO.class);
    }

    public MaterialResponseDTO getMaterialDetails(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Material não encontrado para o id: " + id));

        material.setTotalView(material.getTotalView() + 1);
        materialRepository.save(material);

        return mapper.map(materialRepository.save(material), MaterialResponseDTO.class);
    }

    public List<MaterialResponseDTO> getAllMaterials() {
        return materialRepository.findAll().stream().map(material ->
            mapper.map(material, MaterialResponseDTO.class)
        ).collect(Collectors.toList());
    }
}