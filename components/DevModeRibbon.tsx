import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function DevModeRibbon() {
  const insets = useSafeAreaInsets();

  if (!__DEV__) {
    return null;
  }

  return (
    <View
      pointerEvents="none"
      style={[
        styles.devRibbonContainer,
        { top: Math.max(insets.top - 16, 44) },
      ]}
    >
      <View style={styles.devRibbon}>
        <Text style={styles.devRibbonText}>DEV</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  devRibbonContainer: {
    position: "absolute",
    overflow: "visible",
    right: -70,
    zIndex: 9999,
    elevation: 9999,
  },
  devRibbon: {
    alignItems: "center",
    backgroundColor: "#F97316",
    borderColor: "#FFFFFF",
    borderWidth: StyleSheet.hairlineWidth,
    height: 18,
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    transform: [{ rotate: "45deg" }],
    width: 180,
  },
  devRibbonText: {
    color: "#FFFFFF",
    fontFamily: "pretendard_bold",
    fontSize: 10,
    letterSpacing: 0,
    lineHeight: 12,
  },
});
