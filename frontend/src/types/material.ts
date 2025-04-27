export interface Material {
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
    totalDownload: number;
    totalView: number;
    likeCount: number;
    liked: boolean;
    commentCount: number;
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
    totalDownload: number;
    totalView: number;
    likeCount: number;
    liked: boolean;
    commentCount: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface MaterialCardProps {
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
interface PageResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
    unpaged: boolean
    paged: boolean
  }
  last: boolean
  totalElements: number
  totalPages: number
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  first: boolean
  numberOfElements: number
  empty: boolean
}
export interface MaterialSearchParams {
  page?: number
  size?: number
  type?: string
  area?: string
  search?: string
  sort?: string
  dateRange?: number
  minDownloads?: number
}