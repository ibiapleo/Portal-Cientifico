package com.cesarschool.portalcientifico.domain.upload;

import lombok.Getter;

@Getter
public enum TypeMaterial {
    ARTICLE("Artigo"),
    TCC("Trabalho de Conclusão de Curso"),
    NOTES("Resumo"),
    PRESENTATION("Apresentação"),
    EXERCISE("Lista de Exercícios"),
    OTHER("Outros");

    private final String description;

    TypeMaterial(String description) {
        this.description = description;
    }

}
