package com.cesarschool.portalcientifico.domain.material.dto;

import lombok.Getter;

@Getter
public enum TypeMaterial {
    ARTICLE("Artigo"),
    IMAGE("Imagem"),
    TCC("TCC"),
    NOTES("Resumo"),
    PRESENTATION("Apresentação"),
    EXERCISE("Lista de Exercícios"),
    OTHER("Outros");

    private final String description;

    TypeMaterial(String description) {
        this.description = description;
    }

}
