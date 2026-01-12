import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

const fetchCategories = async () => {
  const { data } = await api.get('/categories');
  return data;
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10 // 10 minutes
  });
};
