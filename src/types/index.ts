export interface Item {
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
}

export interface CreateItemDto extends Omit<Item, 'id' | 'createdAt' | 'updatedAt'> {}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  nextPage: number | null;
} 