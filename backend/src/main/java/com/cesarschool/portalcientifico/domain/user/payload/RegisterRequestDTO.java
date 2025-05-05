package com.cesarschool.portalcientifico.domain.user.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequestDTO {

    private String name;
    private String email;
    private String password;
    private MultipartFile profilePicture;
}
