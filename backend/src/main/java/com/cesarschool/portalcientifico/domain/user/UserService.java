package com.cesarschool.portalcientifico.domain.user;

import com.cesarschool.portalcientifico.domain.s3.S3Service;
import com.cesarschool.portalcientifico.domain.user.follow.Follow;
import com.cesarschool.portalcientifico.domain.user.follow.FollowRepository;
import com.cesarschool.portalcientifico.domain.user.payload.*;
import com.cesarschool.portalcientifico.exception.EmailAlreadyExistsException;
import com.cesarschool.portalcientifico.exception.EntityNotFoundException;
import com.cesarschool.portalcientifico.infra.security.TokenService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final S3Service s3Service;
    private final ModelMapper mapper;

    public RegisterResponseDTO registerUser(RegisterRequestDTO registerRequestDTO) throws IOException {
        validateEmailUniqueness(registerRequestDTO.getEmail());
        User newUser = User.builder()
                .name(registerRequestDTO.getName())
                .email(registerRequestDTO.getEmail())
                .password(passwordEncoder.encode(registerRequestDTO.getPassword()))
                .role(UserRole.USER)
                .build();
        User savedUser = userRepository.save(newUser);
        String fileName = s3Service.uploadFile(registerRequestDTO.getProfilePicture(), savedUser.getId());
        savedUser.setProfilePictureFileName(fileName);
        userRepository.save(savedUser);
        return new RegisterResponseDTO(savedUser.getEmail(), savedUser.getName());
    }
    public TokenResponseDTO login(LoginRequestDTO loginRequestDTO) {
        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Email ou senha incorretos"));

        if (!passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Email ou senha incorretos");
        }

        String accessToken = tokenService.generateAccessToken(user);
        String refreshToken = tokenService.generateRefreshToken(user);

        UserResponseDTO userResponseDTO = mapper.map(user, UserResponseDTO.class);

        if (user.getProfilePictureFileName() != null) {
            String presignedUrl = s3Service.generatePresignedUrl(user.getProfilePictureFileName());
            userResponseDTO.setProfilePictureUrl(presignedUrl);
        }

        return new TokenResponseDTO(accessToken, refreshToken, userResponseDTO);
    }

    public TokenResponseDTO refreshToken(String refreshToken) {
        User user = tokenService.validateRefreshToken(refreshToken)
                .orElseThrow(() -> new BadCredentialsException("Refresh token é inválido"));
        String newAccessToken = tokenService.generateAccessToken(user);
        return TokenResponseDTO.builder().accessToken(newAccessToken).build();
    }

    public void logout(String refreshToken, User user) {
        validateRefreshToken(refreshToken, user);
        user.setRefreshToken(null);
        userRepository.save(user);
    }

    private void validateEmailUniqueness(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("O email informado ja existe: " + email);
        }
    }

    public void validateRefreshToken(String refreshToken, User user) {
        if (user.getRefreshToken() == null || !user.getRefreshToken().equals(refreshToken)) {
            throw new BadCredentialsException("Invalid refresh token");
        }
    }

    @Transactional
    public boolean toggleFollow(User user, String targetUserId) {
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário alvo não encontrado"));

        boolean alreadyFollowing = followRepository.existsByUserIdAndTargetUserId(user.getId(), targetUserId);

        if (alreadyFollowing) {
            followRepository.deleteByUserIdAndTargetUserId(user.getId(), targetUserId);
            return false;
        } else {
            followRepository.save(Follow.builder().user(user).targetUser(targetUser).build());
            return true;
        }
    }

    @Transactional(readOnly = true)
    public boolean checkFollowStatus(User user, String targetUserId) {
        if (user.getId().equals(targetUserId)) {
            return false;
        }
        return followRepository.existsByUserIdAndTargetUserId(user.getId(), targetUserId);
    }
}
