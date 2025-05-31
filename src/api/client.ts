import axios from 'axios';
import type { Item, CreateItemDto, PaginatedResponse } from '../types';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'test' ? '' : 'http://localhost:3001',
});

export const itemsApi = {
  getItems: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Item>> => {
    if (process.env.NODE_ENV === 'test') {
      const res = await fetch(`/items?_page=${page}&_limit=${limit}`);
      const data = await res.json();
      const total = parseInt(res.headers.get('x-total-count') || '0');
      const totalPages = Math.ceil(total / limit);
      return {
        data: data.data,
        total,
        page,
        limit,
        nextPage: page < totalPages ? page + 1 : null,
      };
    } else {
      const response = await api.get(`/items?_page=${page}&_limit=${limit}`);
      const total = parseInt(response.headers['x-total-count'] || '0');
      const totalPages = Math.ceil(total / limit);
      return {
        data: response.data.data,
        total,
        page,
        limit,
        nextPage: page < totalPages ? page + 1 : null,
      };
    }
  },

  createItem: async (item: CreateItemDto): Promise<Item> => {
    const response = await api.post('/items', {
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },
}; 