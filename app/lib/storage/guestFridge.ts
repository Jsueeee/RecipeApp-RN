import { CATEGORY_NAME_MAPPING } from "@/app/(tabs)/(fridge)/constants/fridgeTabs";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import {
  CategorizedFridgeBasket,
  FreshnessLevel,
  FridgeBasket,
  Fridges,
} from "@/app/types/domain/fridge";
import { PickIngredient } from "@/app/types/domain/ingredient";
import { MutationCallbacks } from "@/app/types/common/mutation";
import {
  CATEGORY_IDS,
  CategoryId,
  FoodDataManager,
} from "@/constants/IngredientManager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../query/client";

const GUEST_BASKET_KEY = "@guest_fridge_basket";
const GUEST_FRIDGE_KEY = "@guest_fridge";

type GuestIngredient = {
  id: number;
  ingredientId: number;
  ingredientName: string;
  ingredientIconId: number | null;
  categoryId: CategoryId;
  categoryName: string;
  expiredAt: string | null;
  quantity: number;
  unit: string | null;
};

const GUEST_QUERY_KEYS = {
  ROOT: ["guest-fridge"] as const,
  BASKET: () => [...GUEST_QUERY_KEYS.ROOT, "basket"] as const,
  FRIDGES: () => [...GUEST_QUERY_KEYS.ROOT, "fridges"] as const,
  INGREDIENT_NAMES: () =>
    [...GUEST_QUERY_KEYS.ROOT, "ingredient-names"] as const,
};

const readGuestIngredients = async (key: string): Promise<GuestIngredient[]> => {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeGuestIngredients = async (
  key: string,
  ingredients: GuestIngredient[],
) => {
  await AsyncStorage.setItem(key, JSON.stringify(ingredients));
};

const getIngredientCategory = (
  ingredient: PickIngredient,
): { categoryId: CategoryId; categoryName: string } => {
  const iconInfo = FoodDataManager.getIconInfo(ingredient.ingredientIconId);
  const categoryId = iconInfo?.categoryId ?? CATEGORY_IDS.ETC;

  return {
    categoryId,
    categoryName: CATEGORY_NAME_MAPPING[categoryId],
  };
};

const mapPickIngredientToGuestIngredient = (
  ingredient: PickIngredient,
): GuestIngredient => {
  const { categoryId, categoryName } = getIngredientCategory(ingredient);

  return {
    id: ingredient.ingredientId,
    ingredientId: ingredient.ingredientId,
    ingredientName: ingredient.ingredientName,
    ingredientIconId: ingredient.ingredientIconId,
    categoryId,
    categoryName,
    expiredAt: null,
    quantity: 1,
    unit: null,
  };
};

const groupByCategory = (ingredients: GuestIngredient[]) =>
  Object.values(CATEGORY_IDS)
    .map((categoryId) => {
      const categoryIngredients = ingredients.filter(
        (ingredient) => ingredient.categoryId === categoryId,
      );

      return {
        categoryId,
        categoryName: CATEGORY_NAME_MAPPING[categoryId],
        ingredients: categoryIngredients,
      };
    })
    .filter((category) => category.ingredients.length > 0);

const getGuestBasket = async (): Promise<FridgeBasket> => {
  const basketItems = await readGuestIngredients(GUEST_BASKET_KEY);

  return {
    fridgeBasketCount: basketItems.length,
    ingredientCategories: groupByCategory(basketItems).map(
      (category): CategorizedFridgeBasket => ({
        ingredientCategoryId: category.categoryId,
        ingredientCategoryName: category.categoryName,
        fridgeBaskets: category.ingredients.map((ingredient) => ({
          fridgeBasketId: ingredient.id,
          ingredientName: ingredient.ingredientName,
          ingredientIconId: ingredient.ingredientIconId,
          expiredAt: ingredient.expiredAt,
          freshness: FreshnessLevel.FRESH,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        })),
      }),
    ),
  };
};

const getGuestFridges = async (): Promise<Fridges> => {
  const fridgeItems = await readGuestIngredients(GUEST_FRIDGE_KEY);
  const basketItems = await readGuestIngredients(GUEST_BASKET_KEY);

  return {
    basketCount: basketItems.length,
    categories: groupByCategory(fridgeItems).map((category) => ({
      categoryName: category.categoryName,
      ingredients: category.ingredients.map((ingredient) => ({
        fridgeId: ingredient.id,
        categoryIdx: ingredient.categoryId,
        categoryName: ingredient.categoryName,
        name: ingredient.ingredientName,
        ingredientIconId: ingredient.ingredientIconId,
        expiredAt: ingredient.expiredAt,
        freshness: FreshnessLevel.FRESH,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      })),
    })),
  };
};

const invalidateGuestFridge = () => {
  queryClient.invalidateQueries({ queryKey: GUEST_QUERY_KEYS.ROOT });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECIPE.ROOT });
};

export const addGuestBasketIngredients = async (
  ingredients: PickIngredient[],
) => {
  const prev = await readGuestIngredients(GUEST_BASKET_KEY);
  const prevIds = new Set(prev.map((ingredient) => ingredient.ingredientId));
  const next = [
    ...prev,
    ...ingredients
      .filter((ingredient) => !prevIds.has(ingredient.ingredientId))
      .map(mapPickIngredientToGuestIngredient),
  ];

  await writeGuestIngredients(GUEST_BASKET_KEY, next);
};

export const updateGuestBasketIngredient = async ({
  id,
  body,
}: {
  id: number;
  body: { expiredAt?: string | null; quantity: number; unit?: string | null };
}) => {
  const prev = await readGuestIngredients(GUEST_BASKET_KEY);
  const next = prev.map((ingredient) =>
    ingredient.id === id
      ? {
          ...ingredient,
          expiredAt: body.expiredAt ?? null,
          quantity: body.quantity,
          unit: body.unit ?? null,
        }
      : ingredient,
  );

  await writeGuestIngredients(GUEST_BASKET_KEY, next);
};

export const deleteGuestBasketIngredient = async (id: number) => {
  const prev = await readGuestIngredients(GUEST_BASKET_KEY);
  await writeGuestIngredients(
    GUEST_BASKET_KEY,
    prev.filter((ingredient) => ingredient.id !== id),
  );
};

export const saveGuestBasketToFridge = async () => {
  const [basketItems, fridgeItems] = await Promise.all([
    readGuestIngredients(GUEST_BASKET_KEY),
    readGuestIngredients(GUEST_FRIDGE_KEY),
  ]);

  const fridgeIds = new Set(
    fridgeItems.map((ingredient) => ingredient.ingredientId),
  );
  const nextFridgeItems = [
    ...fridgeItems,
    ...basketItems.filter(
      (ingredient) => !fridgeIds.has(ingredient.ingredientId),
    ),
  ];

  await Promise.all([
    writeGuestIngredients(GUEST_FRIDGE_KEY, nextFridgeItems),
    writeGuestIngredients(GUEST_BASKET_KEY, []),
  ]);
};

export const clearGuestFridgeStorage = async () => {
  await AsyncStorage.multiRemove([GUEST_BASKET_KEY, GUEST_FRIDGE_KEY]);
  invalidateGuestFridge();
};

export const getGuestFridgeIngredientNames = async () => {
  const fridgeItems = await readGuestIngredients(GUEST_FRIDGE_KEY);
  return fridgeItems.map((ingredient) => ingredient.ingredientName);
};

export const useGuestFridgeBasketQuery = (options?: { enabled?: boolean }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: GUEST_QUERY_KEYS.BASKET(),
    queryFn: getGuestBasket,
    select: (data) => ({
      ...data,
      ingredientCategories: data.ingredientCategories.filter(
        (category) => category.fridgeBaskets.length > 0,
      ),
    }),
    enabled: options?.enabled ?? true,
    staleTime: 0,
  });

  return {
    categorizedFridgeBaskets: data?.ingredientCategories,
    isLoading,
    isError,
  };
};

export const useGuestFridgesQuery = (options?: { enabled?: boolean }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: GUEST_QUERY_KEYS.FRIDGES(),
    queryFn: getGuestFridges,
    enabled: options?.enabled ?? true,
    staleTime: 0,
  });

  return {
    basketCount: data?.basketCount,
    fridges: data?.categories,
    isLoading,
    isError,
  };
};

export const useGuestFridgeIngredientNamesQuery = (options?: {
  enabled?: boolean;
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: GUEST_QUERY_KEYS.INGREDIENT_NAMES(),
    queryFn: getGuestFridgeIngredientNames,
    enabled: options?.enabled ?? true,
    staleTime: 0,
  });

  return {
    ingredientNames: data ?? [],
    isLoading,
    isError,
  };
};

export const useGuestPostFridgeBasketMutation = (
  callbacks?: MutationCallbacks,
) => {
  const mutation = useMutation({
    mutationFn: addGuestBasketIngredients,
    onSuccess: () => {
      invalidateGuestFridge();
      callbacks?.onSuccess?.();
    },
    onError: callbacks?.onError,
  });

  return {
    postGuestFridgeBasket: mutation.mutateAsync,
    isPostGuestBasketPending: mutation.isPending,
  };
};

export const useGuestPostFridgeMutation = (callbacks?: MutationCallbacks) => {
  const mutation = useMutation({
    mutationFn: saveGuestBasketToFridge,
    onSuccess: () => {
      invalidateGuestFridge();
      callbacks?.onSuccess?.();
    },
    onError: callbacks?.onError,
  });

  return {
    postGuestFridge: mutation.mutateAsync,
    isGuestPending: mutation.isPending,
  };
};

export const useGuestPatchFridgeBasketIngredientMutation = (
  callbacks?: MutationCallbacks,
) => {
  const mutation = useMutation({
    mutationFn: updateGuestBasketIngredient,
    onSuccess: () => {
      invalidateGuestFridge();
      callbacks?.onSuccess?.();
    },
    onError: callbacks?.onError,
  });

  return {
    patchGuestFridgeBasketIngredient: mutation.mutateAsync,
    isGuestPatchPending: mutation.isPending,
  };
};

export const useGuestDeleteFridgeBasketIngredientMutation = (
  callbacks?: MutationCallbacks,
) => {
  const mutation = useMutation({
    mutationFn: deleteGuestBasketIngredient,
    onSuccess: () => {
      invalidateGuestFridge();
      callbacks?.onSuccess?.();
    },
    onError: callbacks?.onError,
  });

  return {
    deleteGuestFridgeBasketIngredient: mutation.mutateAsync,
    isGuestDeletePending: mutation.isPending,
  };
};
