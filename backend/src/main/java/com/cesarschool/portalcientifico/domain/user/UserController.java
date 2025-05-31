package com.cesarschool.portalcientifico.domain.user;

import com.cesarschool.portalcientifico.domain.user.payload.UserProfileDTO;
import com.cesarschool.portalcientifico.domain.user.payload.UserResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;
    private final UserService userService;

    @Operation(
            summary = "Obter informações do usuário logado",
            description = "Retorna os dados do usuário autenticado a partir do token JWT"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário autenticado retornado com sucesso",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserProfileDTO.class))),
            @ApiResponse(responseCode = "401", description = "Token inválido ou ausente", content = @Content)
    })
    @GetMapping("/me")
    public UserProfileDTO getCurrentUser(

            @Parameter(hidden = true) Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return userService.getUserProfile(user.getId());
    }
    @GetMapping("/{userId}")
    public UserProfileDTO getUserProfile(
            @PathVariable String userId,
            @Parameter(hidden = true) Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return userService.getUserProfile(userId);
    }

    @Operation(
            summary = "Seguir ou deixar de seguir um usuário",
            description = "Permite que um usuário siga ou deixe de seguir outro usuário com base no seu estado atual"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Operação de seguir ou deixar de seguir realizada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado ou não foi possível realizar a operação")
    })
    @PostMapping("/{targetUserId}/follow")
    public ResponseEntity<Boolean> toggleFollow(
            @PathVariable String targetUserId,
            @Parameter(hidden = true) Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        boolean isNowFollowing = service.toggleFollow(user, targetUserId);
        return ResponseEntity.ok(isNowFollowing);
    }



    @Operation(
            summary = "Verificar se o usuário logado segue o autor",
            description = "Retorna true se o usuário atual segue o autor especificado, senão false."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Status de follow retornado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Usuário alvo não encontrado")
    })
    @GetMapping("/{targetUserId}/follow/status")
    public ResponseEntity<Boolean> checkFollowStatus(
            @PathVariable String targetUserId,
            @Parameter(hidden = true) Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        boolean isFollowing = service.checkFollowStatus(user, targetUserId);
        return ResponseEntity.ok(isFollowing);
    }
}
