import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ItemsTable } from '../ItemsTable';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import type { Item } from '../../types';

const mockItems: Item[] = [
  {
    id: 1,
    name: 'Test Item',
    description: 'Test Description',
    price: 100,
    category: 'Test Category',
    status: 'active',
    createdAt: '2024-03-20T12:00:00Z',
    updatedAt: '2024-03-20T12:00:00Z',
    tags: ['test'],
    rating: 4.5,
    stock: 10,
    isAvailable: true,
  },
];

const server = setupServer(
  http.get('http://localhost:3001/items', () => {
    console.log('MSW handler called (absolute)');
    const responseBody = {
      data: mockItems,
      total: 1,
      page: 1,
      limit: 10,
      nextPage: null,
    };
    console.log('MSW response body (absolute):', responseBody);
    return HttpResponse.json(responseBody, {
      headers: {
        'x-total-count': '1',
        'Content-Type': 'application/json',
      },
    });
  }),
  http.get('/items', () => {
    console.log('MSW handler called (relative)');
    const responseBody = {
      data: mockItems,
      total: 1,
      page: 1,
      limit: 10,
      nextPage: null,
    };
    console.log('MSW response body (relative):', responseBody);
    return HttpResponse.json(responseBody, {
      headers: {
        'x-total-count': '1',
        'Content-Type': 'application/json',
      },
    });
  })
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('ItemsTable', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('renders items table with data', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ItemsTable />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Item')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Test Category')).toBeInTheDocument();
      expect(screen.getByText('Активен')).toBeInTheDocument();
      expect(screen.getByText('4.5')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('Да')).toBeInTheDocument();
    });
  });
}); 