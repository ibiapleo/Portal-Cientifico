package com.cesarschool.portalcientifico.domain.material.dto;

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
    private String type;
    private String area;
    private String author;
    private long likeCount;
    private boolean liked;
    private long commentCount;
    private List<String> keywords;
    private String fileName;
    private int totalDownload;
    private int totalView;
    private String fileSize;
    private String fileType;
    private LocalDateTime uploadDate;
    private LocalDateTime createdAt;
}
