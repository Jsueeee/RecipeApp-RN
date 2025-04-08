import { MainTabHeader } from "@/components/MainTabHeader";
import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import { SearchBar } from "./components/SearchBar";

export default function SearchScreen() {
  const [keyword, setKeyword] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MainTabHeader tab="search" />

      <SearchBar
        keyword={keyword}
        onValueChange={setKeyword}
        onSearch={() => {}}
      />
    </SafeAreaView>
  );
}
