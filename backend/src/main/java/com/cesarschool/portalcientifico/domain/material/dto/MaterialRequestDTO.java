package com.cesarschool.portalcientifico.domain.material.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotNull
    private TypeMaterial type;

    @NotNull
    private Area area;

    private List<String> keywords;
}
