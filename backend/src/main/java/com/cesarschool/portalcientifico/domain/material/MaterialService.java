package com.cesarschool.portalcientifico.domain.material;

import com.cesarschool.portalcientifico.domain.material.dto.*;
import com.cesarschool.portalcientifico.domain.s3.S3Service;
import com.cesarschool.portalcientifico.domain.user.User;
import com.cesarschool.portalcientifico.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

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
        Material material = materialRepository.findByIdWithJoin(id)
                .orElseThrow(() -> new EntityNotFoundException("Material não encontrado para o id: " + id));

        material.setTotalView(material.getTotalView() + 1);
        materialRepository.save(material);

        MaterialResponseDTO dto = mapper.map(material, MaterialResponseDTO.class);

        dto.setAuthor(material.getUser().getName());
        dto.setArea(material.getArea().getDescription());
        dto.setType(material.getType().getDescription());
        dto.setAuthorId(material.getUser().getId());

        return dto;
    }

    public Page<MaterialResponseDTO> getAllMaterialsByUser(User user, Pageable pageable) {
        return materialRepository.findByUser(user, pageable)
                .map(material -> {
                    MaterialResponseDTO dto = mapper.map(material, MaterialResponseDTO.class);
                    dto.setArea(material.getArea().getDescription());
                    dto.setType(material.getType().getDescription());
                    dto.setAuthor(material.getUser().getName());
                    dto.setCommentCount(material.getComments().size());
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

    public Page<MaterialResponseDTO> getMaterials(String search, List<TypeMaterial> types, List<Area> areas, Integer dateRange, Integer minDownloads, Pageable pageable) {
        LocalDateTime pastDate = (dateRange != null)
                ? LocalDateTime.now().minusYears(dateRange)
                : LocalDateTime.of(1970, 1, 1, 0, 0);
        search = search != null ? search : "";
        return materialRepository
                .findByFilters(search, types, areas, pastDate, minDownloads, pageable)
                .map(material -> {
                    MaterialResponseDTO dto = mapper.map(material, MaterialResponseDTO.class);
                    dto.setArea(material.getArea().getDescription());
                    dto.setCommentCount(material.getComments().size());
                    dto.setType(material.getType().getDescription());
                    dto.setAuthor(material.getUser().getName());
                    return dto;
                });
    }

    public Page<MaterialResponseDTO> getRecommendedMaterials(User user, Pageable pageable) {
        var preferredAreas = user.getPreferredAreas();

        Page<Material> page;

        if (preferredAreas == null || preferredAreas.isEmpty()) {
            page = materialRepository.findAllByOrderByTotalDownloadDesc(pageable);
        } else {
            page = materialRepository.findByAreaIn(preferredAreas, pageable);
        }

        return page.map(material -> {
            MaterialResponseDTO dto = mapper.map(material, MaterialResponseDTO.class);
            dto.setArea(material.getArea().getDescription());
            dto.setType(material.getType().getDescription());
            dto.setAuthor(material.getUser().getName());
            return dto;
        });
    }

    public List<String> getTrendingTopics() {
        return materialRepository.findTopTrendingTags(PageRequest.of(0, 10));
    }

    public Page<MaterialResponseDTO> getTrendingMaterials(Pageable pageable) {
        return materialRepository.findAllByOrderByTotalDownloadDesc(pageable)
                .map(material -> {
                    MaterialResponseDTO dto = mapper.map(material, MaterialResponseDTO.class);
                    dto.setArea(material.getArea().getDescription());
                    dto.setType(material.getType().getDescription());
                    dto.setAuthor(material.getUser().getName());
                    return dto;
                });
    }

    @Transactional
    public void deleteMaterial(Long id, User user) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Material não encontrado"));

        if (!material.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Você não tem permissão para deletar este material");
        }
        materialRepository.delete(material);
    }
}
