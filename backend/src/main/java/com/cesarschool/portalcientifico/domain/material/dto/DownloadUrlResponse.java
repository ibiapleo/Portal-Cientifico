package com.cesarschool.portalcientifico.domain.material.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DownloadUrlResponse {

    private String url;
    private String fileName;

}