import { useQuery } from "@tanstack/react-query";
import { getFromFirebase } from "../api/firebaseAPI";

export const useCategories = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const data = await getFromFirebase("categories");
      return Object.entries(data || {}).map(([key, value]: any) => ({
        id: key,
        type: value.type,
        category: value.category,
        date: value.date,
      }));
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    categoriesList: data ?? [],
    loadingCategories: isLoading,
    error: isError,
    refetchCategories: refetch,
  };
};
