import { Header } from "@/components/Header";
import { router } from "expo-router";
import { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  title: string;
  children: ReactNode;
  backgroundColor?: string;
  footer?: ReactNode;
  isShowHeader?: boolean;
  onBackClick?: () => void;
}

export function ScreenLayout({
  title,
  children,
  backgroundColor = "white",
  footer,
  isShowHeader = true,
  onBackClick,
}: Props) {
  return (
    <SafeAreaView className={`flex-1 bg-${backgroundColor}`}>
      {isShowHeader && (
        <Header title={title} onBackClick={onBackClick ?? router.back} />
      )}

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>

      <View className="px-4">{footer}</View>
    </SafeAreaView>
  );
}
