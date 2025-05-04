import { apiClient } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { ResponsePickIngredients } from "@/app/types/api/ingredient";

import { useQuery } from "@tanstack/react-query";

interface UseMyIngredientsQueryProps {
  keyword?: string;
}

export const useMyIngredientsQuery = ({
  keyword,
}: UseMyIngredientsQueryProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.INGREDIENT.MY, keyword],
    queryFn: async () => {
      const response = await apiClient.get<ResponsePickIngredients>(
        "/ingredients/my",
        {
          params: { keyword },
        }
      );
      return response.data;
    },
    select: (data) => ({
      ...data,
      ingredientCategories: data.ingredientCategories.filter(
        (category) => category.ingredients.length > 0
      ),
    }),
    staleTime: 1000 * 60 * 60 * 10, // 재료 추가를 하기 전에는 거의 불변
  });

  return {
    categorizedIngredients: data?.ingredientCategories,
    isLoading,
    isError,
  };
};
