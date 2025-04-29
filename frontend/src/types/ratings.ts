export type RatingResponseDTO = {
    value: number;
}

export type UserRatingResponse = {
    hasRated: boolean;
    userRating: number | null;
}