import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useLanguageStore } from '@/store/useLanguageStore';

const fetchBreakingNews = async (language) => {
  const { data } = await api.get(`/articles?flag=breaking&lang=${language}`);
  return data ?? [];
};

export const useBreakingNews = () => {
  const language = useLanguageStore((state) => state.language);
  
  return useQuery({
    queryKey: ['breaking-news', language],
    queryFn: () => fetchBreakingNews(language),
    initialData: []
  });
};

