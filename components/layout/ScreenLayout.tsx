import { Header } from "@/components/Header";
import { router } from "expo-router";
import { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  title?: string;
  children: ReactNode;
  backgroundColor?: string;
  footer?: ReactNode;
  isShowHeader?: boolean;
  isScrollEnabled?: boolean;
  onBackClick?: () => void;
  edges?: ("top" | "bottom")[];
}

export function ScreenLayout({
  title = "",
  children,
  backgroundColor = "white",
  footer,
  isShowHeader = true,
  isScrollEnabled = false,
  edges,
  onBackClick,
}: Props) {
  return (
    <SafeAreaView className={`flex-1 bg-${backgroundColor}`} edges={edges}>
      {isShowHeader && (
        <Header title={title} onBackClick={onBackClick ?? router.back} />
      )}

      {isScrollEnabled ? (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1">{children}</View>
      )}

      <View>{footer}</View>
    </SafeAreaView>
  );
}
