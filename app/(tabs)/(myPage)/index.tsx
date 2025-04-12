import { ScreenLayout } from "@/components/layout/ScreenLayout";
import React from "react";
import { MyPageHeader } from "./components/MyPageHeader";

export default function MyPageScreen() {
  return (
    <ScreenLayout isShowHeader={false}>
      <MyPageHeader />
    </ScreenLayout>
  );
}
