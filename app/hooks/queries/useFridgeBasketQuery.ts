import { apiClient } from "@/app/lib/api/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import { FridgeBasket } from "@/app/types/domain/fridge";
import { useQuery } from "@tanstack/react-query";

export const useFridgeBasketQuery = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.FRIDGE.BASKET(),
    queryFn: async () => {
      const response = await apiClient.get<FridgeBasket>("/fridges/basket");
      return response.data;
    },
    select: (data) => ({
      ...data,
      ingredientCategories: data.ingredientCategories.filter(
        (category) => category.fridgeBaskets.length > 0
      ),
    }),
    staleTime: 0,
  });

  return {
    categorizedFridgeBaskets: data?.ingredientCategories,
    isLoading,
    isError,
  };
};
