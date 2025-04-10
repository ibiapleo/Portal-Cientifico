package com.cesarschool.portalcientifico.domain.upload;

import com.cesarschool.portalcientifico.domain.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MaterialResponseDTO {

    private Long id;
    private String title;
    private String description;
    private TypeMaterial type;
    private Area area;
    private List<String> keywords;
    private String fileName;
    private int totalDownload;
    private int totalView;
    private LocalDateTime uploadDate;
    private LocalDateTime creationDate;
}
