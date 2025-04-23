export interface Comment {
    id: string;
    materialId: string;
    userId: string;
    author: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    likes: number;
}

export interface AddCommentData {
    materialId: string;
    content: string;
}

export interface CommentLikeData {
    commentId: string;
}

export interface CommentProps {
    comment: Comment;
    onLike?: (commentId: string) => void;
}

export interface ToggleCommentLikeData {
    materialId: string;
    commentId: string;
}
