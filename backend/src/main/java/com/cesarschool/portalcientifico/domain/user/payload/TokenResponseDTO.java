package com.cesarschool.portalcientifico.domain.user.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenResponseDTO {

    String accessToken;
    String refreshToken;
    String name;
}
