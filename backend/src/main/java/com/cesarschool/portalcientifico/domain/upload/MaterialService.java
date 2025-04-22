package com.cesarschool.portalcientifico.domain.upload;

import com.cesarschool.portalcientifico.domain.user.User;
import com.cesarschool.portalcientifico.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
                .fileSize(formatFileSize(file.getSize()))
                .fileType(file.getContentType())
                .user(user)
                .uploadDate(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();

        materialRepository.save(material);

        return mapper.map(material, MaterialResponseDTO.class);
    }

    public MaterialResponseDTO getMaterialDetails(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Material não encontrado para o id: " + id));

        material.setTotalView(material.getTotalView() + 1);
        materialRepository.save(material);

        MaterialResponseDTO dto = mapper.map(material, MaterialResponseDTO.class);
        dto.setAuthor(material.getUser().getName());

        return dto;
    }

    public Page<MaterialResponseDTO> getAllMaterialsByUser(User user, Pageable pageable) {
        return materialRepository.findByUser(user, pageable)
                .map(material -> {
                    MaterialResponseDTO dto = mapper.map(material, MaterialResponseDTO.class);
                    dto.setArea(material.getArea().getDescription());
                    dto.setType(material.getType().getDescription());
                    dto.setAuthor(material.getUser().getName());
                    return dto;
                });
    }

    public DownloadUrlResponse getFileNameByMaterialId(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Material não encontrado para o id: " + id));
        String presignedUrl = s3Service.generatePresignedUrl(material.getFileName());
        return new DownloadUrlResponse(presignedUrl, material.getFileName());
    }

    private String formatFileSize(long sizeInBytes) {
        if (sizeInBytes < 1024) return sizeInBytes + " B";
        int exp = (int) (Math.log(sizeInBytes) / Math.log(1024));
        char unit = "KMGTPE".charAt(exp - 1);
        return String.format("%.1f %sB", sizeInBytes / Math.pow(1024, exp), unit);
    }
}