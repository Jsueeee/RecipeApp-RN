import { ScreenLayout } from "@/components/layout/ScreenLayout";
import React from "react";
import { MyPageHeader } from "./components/MyPageHeader";
import { useUserInfoQuery } from "@/app/hooks/queries/useUserInfoQuery";

export default function MyPageScreen() {
  const { data: userInfo } = useUserInfoQuery();

  return (
    <ScreenLayout isShowHeader={false} backgroundColor="background-alternative">
      <MyPageHeader />
    </ScreenLayout>
  );
}
