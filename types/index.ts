export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface University {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  website?: string;
  description?: string;
  location: string;
  region: string;
  type: 'PUBLIC' | 'PRIVATE';
  programs: string[];
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rating {
  id: string;
  userId: string;
  universityId: string;
  education: number;
  instructors: number;
  food: number;
  beauty: number;
  behavior: number;
  admin: number;
  library: number;
  dormitory: number;
  security: number;
  overall: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  content: string;
  userId: string;
  universityId: string;
  likes: number;
  isHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
}
