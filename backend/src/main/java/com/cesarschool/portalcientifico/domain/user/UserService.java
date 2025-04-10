package com.cesarschool.portalcientifico.domain.user;

import com.cesarschool.portalcientifico.domain.user.payload.*;
import com.cesarschool.portalcientifico.exception.EmailAlreadyExistsException;
import com.cesarschool.portalcientifico.infra.security.TokenService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final ModelMapper mapper;

    public RegisterResponseDTO registerUser(RegisterRequestDTO registerRequestDTO) {
        validateEmailUniqueness(registerRequestDTO.getEmail());

        User newUser = User.builder()
                .name(registerRequestDTO.getName())
                .email(registerRequestDTO.getEmail())
                .password(passwordEncoder.encode(registerRequestDTO.getPassword()))
                .role(UserRole.USER)
                .build();

        userRepository.save(newUser);
        return new RegisterResponseDTO(newUser.getEmail(), newUser.getName());
    }

    public TokenResponseDTO login(LoginRequestDTO loginRequestDTO) {
        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Email or password incorrect"));

        if (!passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Email or password incorrect");
        }

        String accessToken = tokenService.generateAccessToken(user);
        String refreshToken = tokenService.generateRefreshToken(user);

        return new TokenResponseDTO(accessToken, refreshToken, user.getName());
    }

    public TokenResponseDTO refreshToken(String refreshToken) {
        User user = tokenService.validateRefreshToken(refreshToken)
                .orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));

        String newAccessToken = tokenService.generateAccessToken(user);
        return new TokenResponseDTO(newAccessToken, refreshToken, user.getName());
    }

    public void logout(String refreshToken) {
        User user = tokenService.validateRefreshToken(refreshToken)
                .orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));

        user.setRefreshToken(null);
        userRepository.save(user);
    }

    private void validateEmailUniqueness(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("Email already exists: " + email);
        }
    }

    public UserResponseDTO getCurrentUser(String token) {
        User user = tokenService.validateAccessToken(token)
                .orElseThrow(() -> new BadCredentialsException("Invalid access token"));

        return new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCreatedAt());
    }
}
