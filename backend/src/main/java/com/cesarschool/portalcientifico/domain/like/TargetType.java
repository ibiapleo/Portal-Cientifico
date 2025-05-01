package com.cesarschool.portalcientifico.domain.like;

import lombok.Getter;

@Getter
public enum TargetType{
    COMMENT("Comentário"),
    MATERIAL("Material");

    private final String label;

    TargetType(String label) {
        this.label = label;
    }
}