import { useEffect, useState, useCallback } from "react";
import { getFromFirebase } from "../api/firebaseAPI";

export const useCategories = () => {
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getFromFirebase("categories");
      const categories = Object.entries(data || {}).map(
        ([key, value]: any) => ({
          id: key,
          type: value.type,
          category: value.category,
          date: value.date,
        })
      );
      setCategoriesList(categories);
    } catch (error) {
      console.error("Error fetching categories", error);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categoriesList,
    loadingCategories,
    refetchCategories: fetchCategories,
  };
};
