export interface ProjectItem {
  id: number;
  name: string;
  description?: string;
  ownerId?: number;
  ownerName?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectListResponse {
  content: ProjectItem[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface ProjectPayload {
  name: string;
  description?: string;
  ownerId?: number;
  status?: string;
}
