import { Platform, Switch, type SwitchProps } from "react-native";

export function AppSwitch({ style, ...props }: SwitchProps) {
  return (
    <Switch
      trackColor={{ false: "#E9E9EA", true: "#4BD2B0" }}
      thumbColor="#FFFFFF"
      ios_backgroundColor="#E9E9EA"
      style={[
        {
          transform: [
            {
              scale: Platform.OS === "ios" ? 0.8 : 1.3,
            },
          ],
          marginRight: Platform.OS === "ios" ? 0 : 4,
        },
        style,
      ]}
      {...props}
    />
  );
}
