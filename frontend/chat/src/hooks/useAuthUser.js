import { useQuery } from '@tanstack/react-query';
import { getAuthUser } from '../lib/api';

const useAuthUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: getAuthUser,
    retry: false,
  });

  const authUser = data?.user || data || null;

  return { isLoading, authUser };
};

export default useAuthUser;
