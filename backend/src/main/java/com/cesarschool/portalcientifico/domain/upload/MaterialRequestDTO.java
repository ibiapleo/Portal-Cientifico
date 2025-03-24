package com.cesarschool.portalcientifico.domain.upload;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MaterialRequestDTO {

    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String type;

    @NotBlank
    private String discipline;

    @NotBlank
    private String knowledgeArea;

    private List<String> keywords;
}
