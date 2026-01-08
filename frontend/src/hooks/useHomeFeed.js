import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useLanguageStore } from '@/store/useLanguageStore';

const fetchHome = async (language) => {
  const { data } = await api.get(`/home?lang=${language}`);
  return data;
};

export const useHomeFeed = () => {
  const language = useLanguageStore((state) => state.language);
  
  return useQuery({
    queryKey: ['home-feed', language],
    queryFn: () => fetchHome(language)
  });
};

