package com.cesarschool.portalcientifico.domain.upload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MaterialResponseDTO {

    private Long id;
    private String title;
    private String fileName;
    private String type;
    private String discipline;
    private String knowledgeArea;
    private int totalDownload;
    private int totalView;
    private String uploadDate;
}
