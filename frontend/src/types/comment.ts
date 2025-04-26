export interface CommentRequestDTO {
    content: string;
  }
  
  export interface CommentResponseDTO {
    id: number;
    content: string;
    author: string;
    createdAt: string;
    likes: number;
  }