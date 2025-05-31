import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Stack,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { itemsApi } from '../api/client';
import type { CreateItemDto } from '../types';
import { useState } from 'react';

const schema = yup.object({
  name: yup.string().required('Название обязательно'),
  description: yup.string().required('Описание обязательно'),
  price: yup.number().required('Цена обязательна').positive('Цена должна быть положительной'),
  category: yup.string().required('Категория обязательна'),
  status: yup.string().oneOf(['active', 'inactive'] as const).required('Статус обязателен'),
  tags: yup.array().of(yup.string()).min(1, 'Требуется хотя бы один тег').required('Теги обязательны'),
  rating: yup.number().required('Рейтинг обязателен').min(0).max(5),
  stock: yup.number().required('Количество обязательно').integer('Количество должно быть целым числом').min(0),
  isAvailable: yup.boolean().required('Доступность обязательна'),
}).required();

type FormData = yup.InferType<typeof schema>;

export const CreateItemForm = () => {
  const queryClient = useQueryClient();
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 'active',
      isAvailable: true,
      tags: [],
      rating: 0,
      stock: 0,
    },
  });

  const handleTagInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  };

  const handleTagInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && tagInput.trim()) {
      event.preventDefault();
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue('tags', newTags);
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    const newTags = tags.filter(tag => tag !== tagToDelete);
    setTags(newTags);
    setValue('tags', newTags);
  };

  const createItemMutation = useMutation({
    mutationFn: itemsApi.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      reset();
      setTags([]);
    },
  });

  const onSubmit = (data: FormData) => {
    createItemMutation.mutate(data as CreateItemDto);
  };

  const currentStatus = watch('status');

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Stack spacing={3}>
        <TextField
          label="Название"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Описание"
          multiline
          rows={4}
          {...register('description')}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <TextField
          label="Цена"
          type="number"
          {...register('price')}
          error={!!errors.price}
          helperText={errors.price?.message}
        />
        <TextField
          label="Категория"
          {...register('category')}
          error={!!errors.category}
          helperText={errors.category?.message}
        />
        <FormControl error={!!errors.status}>
          <InputLabel>Статус</InputLabel>
          <Select
            {...register('status')}
            label="Статус"
            value={currentStatus || 'active'}
          >
            <MenuItem value="active">Активен</MenuItem>
            <MenuItem value="inactive">Неактивен</MenuItem>
          </Select>
        </FormControl>
        <Box>
          <TextField
            label="Теги"
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyDown={handleTagInputKeyDown}
            error={!!errors.tags}
            helperText={errors.tags?.message || "Нажмите Enter для добавления тега"}
            fullWidth
          />
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleDeleteTag(tag)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
        <TextField
          label="Рейтинг"
          type="number"
          inputProps={{ step: 0.1, min: 0, max: 5 }}
          {...register('rating')}
          error={!!errors.rating}
          helperText={errors.rating?.message}
        />
        <TextField
          label="Количество"
          type="number"
          {...register('stock')}
          error={!!errors.stock}
          helperText={errors.stock?.message}
        />
        <FormControlLabel
          control={<Switch {...register('isAvailable')} />}
          label="Доступен"
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting || createItemMutation.isPending}
        >
          {isSubmitting || createItemMutation.isPending ? 'Создание...' : 'Создать элемент'}
        </Button>
      </Stack>
    </Box>
  );
}; 