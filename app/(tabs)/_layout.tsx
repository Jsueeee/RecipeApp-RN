import FridgeIcon from "@/assets/images/ic_nav_fridge.svg";
import MyPageIcon from "@/assets/images/ic_nav_my_page.svg";
import RecipeIcon from "@/assets/images/ic_nav_recipe.svg";
import SearchIcon from "@/assets/images/ic_nav_search.svg";
import i18n from "@/lib/i18n";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import React from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

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
    <Pressable
      {...props}
      android_ripple={null}
      android_disableSound={true}
      onPress={(e) => {
        Haptics.selectionAsync();
        props.onPress?.(e);
      }}
      style={[styles.tabBarButton, style]}
    >
      {children}
    </Pressable>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
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
    paddingVertical: 6,
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
});
