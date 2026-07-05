import { DebouncedPressable } from "@/app/components/DebouncedPressable";
import { TutorialAnchor, useTutorial } from "@/app/tutorial";
import type { AnchorId } from "@/app/tutorial";
import FridgeIcon from "@/assets/images/ic_nav_fridge.svg";
import MyPageIcon from "@/assets/images/ic_nav_my_page.svg";
import RecipeIcon from "@/assets/images/ic_nav_recipe.svg";
import SearchIcon from "@/assets/images/ic_nav_search.svg";
import i18n from "@/lib/i18n";
import { selection as hapticSelection } from "@/app/lib/haptics";
import { router, Tabs } from "expo-router";
import React, { useEffect } from "react";
import {
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_BAR_CONTENT_HEIGHT = 58;
const TAB_BAR_HIT_SLOP = { top: 8, bottom: 8, left: 6, right: 6 };

const TabBarLabel = ({
  focused,
  label,
}: {
  focused: boolean;
  label: string;
}) => (
  <Text
    className={`text-bottom-nav ${
      focused ? "text-text-strong" : "text-text-assistive"
    }`}
  >
    {i18n.t(label)}
  </Text>
);

const TabBarButton = ({
  children,
  style,
  ...props
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
} & Omit<PressableProps, "style">) => {
  return (
    <DebouncedPressable
      {...props}
      android_ripple={null}
      android_disableSound={true}
      hitSlop={TAB_BAR_HIT_SLOP}
      onPress={(e) => {
        hapticSelection();
        props.onPress?.(e);
      }}
      style={[style, styles.tabBarButton]}
    >
      {children}
    </DebouncedPressable>
  );
};

const AnchoredTabBarButton = ({
  anchorId,
  children,
  onNavigate,
  style,
  ...props
}: {
  anchorId: AnchorId;
  children?: React.ReactNode;
  onNavigate: () => void;
  style?: StyleProp<ViewStyle>;
} & Omit<PressableProps, "style">) => {
  const { registerAnchorAction } = useTutorial();

  useEffect(() => {
    registerAnchorAction(anchorId, onNavigate);
  }, [anchorId, onNavigate, registerAnchorAction]);

  return (
    <TutorialAnchor id={anchorId} style={[style, styles.tabBarAnchor]}>
      <DebouncedPressable
        {...props}
        android_ripple={null}
        android_disableSound={true}
        hitSlop={TAB_BAR_HIT_SLOP}
        onPress={(e) => {
          hapticSelection();
          props.onPress?.(e);
        }}
        style={styles.tabAnchorButton}
      >
        {children}
      </DebouncedPressable>
    </TutorialAnchor>
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: TAB_BAR_CONTENT_HEIGHT + insets.bottom,
            paddingBottom: insets.bottom,
          },
        ],
        tabBarButton: (props) => <TabBarButton {...props} />,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: "#4BD2B0",
        tabBarInactiveTintColor: "#7F8A85",
      }}
    >
      <Tabs.Screen
        name="(fridge)"
        options={{
          tabBarIcon: ({ color }) => (
            <FridgeIcon color={color} width={20} height={20} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused} label="bottom_tab.fridge" />
          ),
        }}
      />
      <Tabs.Screen
        name="(recipe)"
        options={{
          tabBarIcon: ({ color }) => (
            <RecipeIcon color={color} width={20} height={20} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused} label="bottom_tab.recipe" />
          ),
          tabBarButton: (props) => (
            <AnchoredTabBarButton
              {...props}
              anchorId="tab-recipe"
              onNavigate={() => router.navigate("/(tabs)/(recipe)")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(search)"
        options={{
          tabBarIcon: ({ color }) => (
            <SearchIcon color={color} width={20} height={20} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused} label="bottom_tab.search" />
          ),
          tabBarButton: (props) => (
            <AnchoredTabBarButton
              {...props}
              anchorId="tab-search"
              onNavigate={() => router.navigate("/(tabs)/(search)")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(myPage)"
        options={{
          tabBarIcon: ({ color }) => (
            <MyPageIcon color={color} width={20} height={20} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused} label="bottom_tab.myPage" />
          ),
          tabBarButton: (props) => (
            <AnchoredTabBarButton
              {...props}
              anchorId="tab-myPage"
              onNavigate={() => router.navigate("/(tabs)/(myPage)")}
            />
          ),
        }}
      />
    </Tabs>
  );
}

export const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ECEFED",
    paddingHorizontal: 16,
    position: "absolute",
    elevation: 0,
    shadowOpacity: 0,
    alignSelf: "center",
  },
  tabBarButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: TAB_BAR_CONTENT_HEIGHT,
    paddingTop: 8,
    paddingBottom: 8,
  },
  tabBarAnchor: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    minHeight: TAB_BAR_CONTENT_HEIGHT,
    padding: 0,
  },
  tabBarIcon: {
    width: 20,
    height: 20,
  },
  tabBarLabel: {
    fontSize: 10,
    lineHeight: 18,
    fontWeight: "600",
    marginTop: 2,
  },
  tabAnchorButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: TAB_BAR_CONTENT_HEIGHT,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 5,
    width: "100%",
  },
});
