export type RatingResponseDTO = {
    value: boolean;
}

export type UserRatingResponse = {
    hasRated: boolean;
    userRating: number | null;
}