import { Header } from "@/components/Header";
import { SafeAreaView, View, ScrollView } from "react-native";
import { ReactNode } from "react";
import { router } from "expo-router";

interface Props {
  title: string;
  children: ReactNode;
  backgroundColor?: string;
  footer?: ReactNode;
  onBackClick?: () => void;
}

export function ScreenLayout({
  title,
  children,
  backgroundColor = "white",
  footer,
  onBackClick,
}: Props) {
  return (
    <SafeAreaView className={`flex-1 bg-${backgroundColor}`}>
      <Header title={title} onBackClick={onBackClick ?? router.back} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        {children}
      </ScrollView>

      <View className="px-4 pb-[22px] mb-safe">{footer}</View>
    </SafeAreaView>
  );
}
