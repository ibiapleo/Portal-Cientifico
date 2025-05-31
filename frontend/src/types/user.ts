export interface UserProfile {
    id: string
    name: string
    email: string
    profilePictureUrl?: string
    coverImageUrl?: string
    institution?: string
    location?: string
    bio?: string
    headline?: string
    website?: string
    joinDate?: string
    verified?: boolean
    role?: string
  
    socialLinks?: {
      github?: string
      linkedin?: string
      twitter?: string
      [key: string]: string | undefined
    }
  
    interests?: string[]
  
    stats?: {
      totalUploads: number
      totalDownloads: number
      totalLikes: number
      followers: number
      following: number
      rating: number
    }
  
    preferences?: {
      emailNotifications: boolean
      publicProfile: boolean
      [key: string]: boolean | undefined
    }
  }
  
  export interface PasswordChangeRequest {
    currentPassword: string
    newPassword: string
  }
  