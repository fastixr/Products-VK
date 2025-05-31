export type Item = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  tags: string[];
  rating: number;
  stock: number;
  isAvailable: boolean;
};

export type CreateItemDto = {
  name: string;
  description: string;
  price: number;
  category: string;
  status: 'active' | 'inactive';
  tags: string[];
  rating: number;
  stock: number;
  isAvailable: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  nextPage: number | null;
}; 