import { useCallback, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { itemsApi } from '../api/client';
import type { Item, PaginatedResponse } from '../types';

export const ItemsTable = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery<PaginatedResponse<Item>>({
    queryKey: ['items'],
    queryFn: ({ pageParam = 1 }) => itemsApi.getItems(pageParam as number),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const observer = useRef<IntersectionObserver>();
  const lastItemRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  if (status === 'pending') return <CircularProgress />;
  if (status === 'error') {
    console.error('Error loading data:', error);
    return <div>Ошибка загрузки данных</div>;
  }
  if (!data) return null;

  return (
    <Box sx={{ mt: 4, overflowX: 'auto' }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '5%', minWidth: '50px' }}>ID</TableCell>
              <TableCell sx={{ width: '15%', minWidth: '150px' }}>Название</TableCell>
              <TableCell sx={{ width: '20%', minWidth: '200px' }}>Описание</TableCell>
              <TableCell sx={{ width: '10%', minWidth: '100px' }}>Цена</TableCell>
              <TableCell sx={{ width: '15%', minWidth: '150px' }}>Категория</TableCell>
              <TableCell sx={{ width: '10%', minWidth: '100px' }}>Статус</TableCell>
              <TableCell sx={{ width: '10%', minWidth: '100px' }}>Рейтинг</TableCell>
              <TableCell sx={{ width: '10%', minWidth: '100px' }}>Количество</TableCell>
              <TableCell sx={{ width: '5%', minWidth: '80px' }}>Доступен</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.pages.map((page) =>
              page.data.map((item: Item, index: number) => (
                <TableRow
                  ref={index === page.data.length - 1 ? lastItemRef : null}
                  key={item.id}
                >
                  <TableCell>{item.id}</TableCell>
                  <TableCell sx={{ maxWidth: '150px' }}>
                    <Typography noWrap>{item.name}</Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: '200px' }}>
                    <Typography noWrap>{item.description}</Typography>
                  </TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell sx={{ maxWidth: '150px' }}>
                    <Typography noWrap>{item.category}</Typography>
                  </TableCell>
                  <TableCell>{item.status === 'active' ? 'Активен' : 'Неактивен'}</TableCell>
                  <TableCell>{item.rating}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>{item.isAvailable ? 'Да' : 'Нет'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {isFetchingNextPage && (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>Загрузка...</Typography>
      )}
    </Box>
  );
}; 