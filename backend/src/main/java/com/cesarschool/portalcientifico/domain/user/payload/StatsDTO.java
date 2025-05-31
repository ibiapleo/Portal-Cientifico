package com.cesarschool.portalcientifico.domain.user.payload;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StatsDTO {
    private int totalUploads;
    private int totalDownloads;
    private int totalLikes;
    private int followers;
    private int following;
    private double rating;
}
