import { useState } from 'react';
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
  Pagination,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { itemsApi } from '../api/client';
import type { Item, PaginatedResponse } from '../types';

export const ItemsTable = () => {
  const [page, setPage] = useState(1);
  const { data, status, error } = useQuery<PaginatedResponse<Item>>({
    queryKey: ['items', page],
    queryFn: () => itemsApi.getItems(page),
  });

  console.log('API Response:', data);

  if (status === 'pending') return <CircularProgress />;
  if (status === 'error') {
    console.error('Error loading data:', error);
    return <div>Ошибка загрузки данных</div>;
  }
  if (!data) return null;
  if (!data.data) {
    console.error('No data array in response:', data);
    return <div>Нет данных для отображения</div>;
  }

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

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
            {data.data.map((item: Item) => (
              <TableRow key={item.id}>
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(data.total / data.limit)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}; 