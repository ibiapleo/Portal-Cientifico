package com.cesarschool.portalcientifico.domain.user.payload;

import com.cesarschool.portalcientifico.domain.user.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {

    private String id;
    private String name;
    private String email;
    private UserRole role;
    private LocalDateTime createdAt;
}