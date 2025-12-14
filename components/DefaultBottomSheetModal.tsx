import { PressableScale } from "@/app/components/PressableScale";
import IC_CLOSE from "@/assets/images/ic_close.svg";
import IC_CHEVRON_LEFT from "@/assets/images/ic_chevron_left.svg";
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
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
  children: React.ReactNode;
  title?: string;
  onOpen?: () => void;
  onDismiss?: () => void;
  scrollEnabled?: boolean;
  footer?: React.ReactNode;
  onBack?: () => void;
  contentStyle?: StyleProp<ViewStyle>;
}

/**
 * 앱 내에서 기본으로 사용할 바텀시트
 */
export default function DefaultBottomSheetModal({
  bottomSheetModalRef,
  children,
  title,
  onOpen,
  onDismiss,
  scrollEnabled = true,
  footer,
  onBack,
  contentStyle,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
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

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    setIsOpen(index !== -1);

    if (index === -1) {
      bottomSheetModalRef.current?.dismiss();
      Keyboard.dismiss();
      onDismiss?.();
    } else {
      onOpen?.();
    }
  }, []);

  const onBackDropPress = () => {
    if (keyboardVisible) {
      Keyboard.dismiss();
      return;
    }
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
          // expo 54 이후 gorhom/bottom-sheet 에서 버그가 있어서 임시 처리
          contentContainerStyle={{ paddingBottom: footer ? 80 : 0 }}
        >
          {children}
        </BottomSheetScrollView>
      );
    }

    return (
      <BottomSheetView
        className="justify-center items-center"
        style={contentStyle}
      >
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
        {onBack && (
          <PressableScale
            onPress={onBack}
            className="absolute left-4"
            hitSlop={10}
          >
            <IC_CHEVRON_LEFT width={24} height={24} color="#3F4542" />
          </PressableScale>
        )}
        {title && <Text className="text-title4 text-text-strong">{title}</Text>}

        <PressableScale
          onPress={() => {
            bottomSheetModalRef.current?.dismiss();
            onDismiss?.();
          }}
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
      enableBlurKeyboardOnGesture={true}
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
