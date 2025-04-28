export type RatingResponseDTO = {
    averageRating: number;
    totalRatings: number;
    distribution: Record<number, number>;
    userRating: number | null;
}

export type RatingRequestDTO = {
    value: number;
}

export type UserRatingResponse = {
    hasRated: boolean;
    rating: number | null;
}