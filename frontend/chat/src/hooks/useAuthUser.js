import { useQuery } from '@tanstack/react-query';
import { getAuthUser } from '../lib/api';

const useAuthUser = () => {
  const {
    data,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['authUser'],
    queryFn: getAuthUser,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const authUser = isSuccess && data?.user ? data.user : null;

  return {
    authUser,
    isLoading,
    isError,
    error,
  };
};

export default useAuthUser;
