package com.cesarschool.portalcientifico.domain.user.payload;

import lombok.Data;

@Data
public class RefreshTokenRequestDTO {
    private String refreshToken;
}
