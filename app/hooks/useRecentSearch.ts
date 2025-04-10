import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const RECENT_SEARCH_KEY = "@recent_search";
const MAX_RECENT_SEARCH = 10;

export const useRecentSearch = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  // 로컬 스토리지에서 최근 검색어 로드
  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCH_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load recent searches:", error);
    }
  };

  // 새로운 검색어 추가
  const addSearch = useCallback(
    async (keyword: string) => {
      if (!keyword.trim()) return;

      try {
        const updatedSearches = [
          keyword,
          ...recentSearches.filter((item) => item !== keyword),
        ].slice(0, MAX_RECENT_SEARCH);

        await AsyncStorage.setItem(
          RECENT_SEARCH_KEY,
          JSON.stringify(updatedSearches)
        );
        setRecentSearches(updatedSearches);
      } catch (error) {
        console.error("Failed to save recent search:", error);
      }
    },
    [recentSearches]
  );

  // 특정 검색어 삭제
  const removeSearch = useCallback(
    async (keyword: string) => {
      try {
        const updatedSearches = recentSearches.filter(
          (item) => item !== keyword
        );
        await AsyncStorage.setItem(
          RECENT_SEARCH_KEY,
          JSON.stringify(updatedSearches)
        );

        setRecentSearches(updatedSearches);
      } catch (error) {
        console.error("Failed to remove recent search:", error);
      }
    },
    [recentSearches]
  );

  // 전체 검색어 삭제
  const clearAllSearches = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(RECENT_SEARCH_KEY);
      setRecentSearches([]);
    } catch (error) {
      console.error("Failed to clear recent searches:", error);
    }
  }, []);

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearAllSearches,
  };
};
