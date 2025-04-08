import { MainTabHeader } from "@/components/MainTabHeader";
import React from "react";
import { SafeAreaView, View } from "react-native";

export default function SearchScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <MainTabHeader tab="search" />
    </SafeAreaView>
  );
}
