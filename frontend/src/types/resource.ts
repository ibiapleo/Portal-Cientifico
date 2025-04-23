export interface Resource {
    id: string;
    title: string;
    type: 'article' | 'thesis' | 'notes' | 'presentation' | 'exercise' | 'other';
    area: string;
    subject: string;
    author: string;
    authorId: string;
    institution?: string;
    description: string;
    fileUrl: string;
    fileType: string;
    fileSize: string;
    pages?: number;
    keywords: string[];
    downloads: number;
    views: number;
    likes: number;
    comments: number;
    createdAt: string;
    updatedAt: string;
  }

  export interface MaterialResponseDTO {
    id: string;
    title: string;
    type: 'article' | 'thesis' | 'notes' | 'presentation' | 'exercise' | 'other';
    area: string;
    subject: string;
    author: string;
    authorId: string;
    institution?: string;
    description: string;
    fileUrl: string;
    fileType: string;
    fileSize: string;
    pages?: number;
    keywords: string[];
    downloads: number;
    views: number;
    likes: number;
    comments: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ResourceCardProps {
    id: string;
    title: string;
    type: string;
    subject: string;
    author: string;
    date: string;
    downloads: number;
    icon: React.ReactNode;
  }
  
  export interface UploadFormData {
    title: string;
    type: string;
    subject: string;
    description: string;
    keywords: string;
    file: File | null;
  }