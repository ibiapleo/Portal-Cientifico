package com.cesarschool.portalcientifico.domain.user.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDTO {
    private String id;
    private String name;
    private String email;
    private String profilePictureUrl;
    private String coverImageUrl;
    private String institution;
    private String location;
    private String bio;
    private String headline;
    private String website;
    private String joinDate;
    private Boolean verified;
    private String role;
    private String github;
    private String linkedin;
    private String twitter;
    private List<String> interests;
    private StatsDTO stats;
}