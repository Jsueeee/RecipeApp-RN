import { PressableScale } from "@/app/components/PressableScale";
import IC_CLOSE from "@/assets/images/ic_close.svg";
import {
  BottomSheetBackdropProps,
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useState } from "react";
import {
  BackHandler,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  children: React.ReactNode;
  title?: string;
  onDismiss?: () => void;
  scrollEnabled?: boolean;
  footer?: React.ReactNode;
}

/**
 * 앱 내에서 기본으로 사용할 바텀시트
 */
export default function DefaultBottomSheetModal({
  bottomSheetModalRef,
  children,
  title,
  onDismiss,
  scrollEnabled = true,
  footer,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const backAction = () => {
      if (isOpen) {
        bottomSheetModalRef.current?.dismiss();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isOpen]);

  const handleSheetChanges = useCallback((index: number) => {
    setIsOpen(index !== -1);

    if (index === -1) {
      bottomSheetModalRef.current?.dismiss();
      Keyboard.dismiss();
      onDismiss?.();
    }
  }, []);

  const onBackDropPress = () => {
    bottomSheetModalRef.current?.dismiss();
    Keyboard.dismiss();
  };

  const backdropComponent = ({
    animatedIndex,
    style,
  }: BottomSheetBackdropProps) => (
    <Pressable onPress={onBackDropPress} style={[style, styles.backdrop]} />
  );

  const renderContent = () => {
    if (scrollEnabled) {
      return (
        <BottomSheetScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
          bounces={false}
          alwaysBounceVertical={false}
        >
          {children}
        </BottomSheetScrollView>
      );
    }

    return (
      <BottomSheetView className="justify-center items-center">
        {children}
      </BottomSheetView>
    );
  };

  const Footer = ({ animatedFooterPosition }: BottomSheetFooterProps) => {
    return (
      <BottomSheetFooter
        animatedFooterPosition={animatedFooterPosition}
        style={{ padding: 16 }}
      >
        {footer}
      </BottomSheetFooter>
    );
  };

  const Handle = () => {
    return (
      <View className="flex-row items-center justify-center p-4">
        {title && <Text className="text-title4 text-text-strong">{title}</Text>}

        <PressableScale
          onPress={() => onDismiss?.()}
          className="absolute right-4"
          hitSlop={10}
        >
          <IC_CLOSE width={24} height={24} color="#3F4542" />
        </PressableScale>
      </View>
    );
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      onChange={handleSheetChanges}
      backgroundStyle={{
        backgroundColor: "white",
        borderRadius: 16,
      }}
      containerStyle={{
        marginHorizontal: 10,
        borderRadius: 16,
      }}
      handleComponent={Handle}
      enableDismissOnClose={true}
      enablePanDownToClose={false}
      enableOverDrag={false}
      enableContentPanningGesture={false}
      backdropComponent={backdropComponent}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      bottomInset={insets.bottom}
      footerComponent={footer ? Footer : undefined}
    >
      {renderContent()}
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
});
