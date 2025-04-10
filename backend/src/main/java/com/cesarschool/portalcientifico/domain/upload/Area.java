package com.cesarschool.portalcientifico.domain.upload;

import lombok.Getter;

@Getter
public enum Area {
    COMPUTER_SCIENCE("Ciência da Computação"),
    ENGINEERING("Engenharia"),
    MEDICINE("Medicina"),
    BUSINESS("Administração"),
    LAW("Direito"),
    PSYCHOLOGY("Psicologia"),
    EDUCATION("Educação"),
    ARTS("Artes"),
    OTHER("Outra");

    private final String description;

    Area(String description) {
        this.description = description;
    }

}
