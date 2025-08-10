import { useRecipeDeleteMutation } from "@/app/hooks/mutations/useRecipeDeleteMutation";
import { useRecipeReportMutation } from "@/app/hooks/mutations/useRecipeReportMutation";
import { useRecipeDetailQuery } from "@/app/hooks/queries/useRecipeDetailQuery";
import { useUserInfoQuery } from "@/app/hooks/queries/useUserInfoQuery";
import { queryClient } from "@/app/lib/query/client";
import { QUERY_KEYS } from "@/app/lib/query/keys";
import IC_MORE from "@/assets/images/ic_more.svg";
import { Header } from "@/components/Header";
import i18n from "@/lib/i18n";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Image, LayoutChangeEvent, View } from "react-native";
import Reanimated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";
import { DeleteRecipeDialog } from "./components/DeleteRecipeDialog";
import { MyRecipeFooter } from "./components/MyRecipeFooter";
import { RecipeDetailInfo } from "./components/RecipeDetailInfo";
import { RecipeFooter } from "./components/RecipeFooter";
import { RecipeMoreMenu } from "./components/RecipeMoreMenu";
import { RecipeTransparentHeader } from "./components/RecipeTransparentHeader";
import { ReportRecipeDialog } from "./components/ReportRecipeDialog";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const { data: recipeDetail } = useRecipeDetailQuery(Number(id));

  const [scrapButtonHeight, setScrapButtonHeight] = useState<number>(0);
  const [isMoreMenuVisible, setIsMoreMenuVisible] = useState(false);
  const [isReportDialogVisible, setIsReportDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  const onScrapLayout = (e: LayoutChangeEvent) => {
    setScrapButtonHeight(e.nativeEvent.layout.height);
  };

  const { userInfo } = useUserInfoQuery();

  const { reportRecipe } = useRecipeReportMutation({
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: QUERY_KEYS.RECIPE.ROOT })
        .then(() => {
          Toast.success(i18n.t("recipe_detail.report_success"));

          router.back();
        });
    },
    onError: () => {
      Toast.error(i18n.t("recipe_detail.report_error"));
    },
  });

  const { deleteRecipe } = useRecipeDeleteMutation({
    onSuccess: () => {
      Toast.success(i18n.t("recipe_detail.delete_success"));
      router.back();
    },
    onError: () => {
      Toast.error(i18n.t("recipe_detail.delete_error"));
    },
  });

  const isMyRecipe = userInfo?.userId === recipeDetail?.postUserId;

  const Footer = isMyRecipe ? (
    <MyRecipeFooter recipeId={recipeDetail?.id} />
  ) : (
    <RecipeFooter
      recipeDetail={recipeDetail}
      scrapButtonHeight={scrapButtonHeight}
      onScrapLayout={onScrapLayout}
    />
  );

  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get("window");
  const HEADER_MAX_HEIGHT = width;
  const TOOLBAR_HEIGHT = 56;
  const HEADER_MIN_HEIGHT = insets.top + TOOLBAR_HEIGHT;

  // Reanimated
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  // 패럴랙스(자연스러운 위/당김)
  const imageAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-120, 0, HEADER_MAX_HEIGHT],
      [20, 0, -HEADER_MAX_HEIGHT * 0.25],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const scale = interpolate(
      scrollY.value,
      [-120, 0, HEADER_MAX_HEIGHT],
      [1.1, 1, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    return { transform: [{ translateY }, { scale }] };
  });

  // 헤더 페이드 포인트
  const CONTENT_OFFSET = 16; // -mt-4 보정
  const touchPoint = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - CONTENT_OFFSET;
  const FADE_DISTANCE = 32;

  // 투명 헤더(이미지 위) → 서서히 사라짐
  const transparentHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, touchPoint], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { opacity };
  });

  // 화이트 헤더 → 서서히 나타남
  const headerBgStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [touchPoint, touchPoint + FADE_DISTANCE],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    return { opacity };
  });
  const headerContentStyle = headerBgStyle;

  const onMoreClick = () => setIsMoreMenuVisible(true);
  const onCloseMoreMenu = () => setIsMoreMenuVisible(false);
  const onReportButtonPress = () => {
    setIsMoreMenuVisible(false);
    setIsReportDialogVisible(true);
  };
  const onDelete = () => {
    setIsMoreMenuVisible(false);
    setIsDeleteDialogVisible(true);
  };
  const onCloseReportDialog = () => setIsReportDialogVisible(false);
  const onReportConfirm = () => {
    if (!recipeDetail?.id) return;
    reportRecipe(recipeDetail.id);
  };
  const onCloseDeleteDialog = () => setIsDeleteDialogVisible(false);
  const onDeleteConfirm = () => {
    if (!recipeDetail?.id) return;
    deleteRecipe(recipeDetail.id);
  };

  return (
    <>
      <View className="flex-1 bg-white">
        <Reanimated.View
          className="absolute inset-x-0 top-0 overflow-hidden"
          style={[{ height: HEADER_MAX_HEIGHT, width }, imageAnimatedStyle]}
        >
          <Image
            source={{ uri: recipeDetail?.thumbnail }}
            className="w-full h-full bg-gray-100 aspect-square max-w-[500px] self-center"
            resizeMode="cover"
          />
        </Reanimated.View>

        <Reanimated.ScrollView
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingTop: HEADER_MAX_HEIGHT,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
        >
          <View className="bg-white -mt-4 rounded-t-2xl">
            <RecipeDetailInfo
              className="px-4 pt-5"
              recipeDetail={recipeDetail}
            />
          </View>
        </Reanimated.ScrollView>

        {/* 이미지 위 투명 헤더(처음 보임 → 닿을수록 사라짐) */}
        <Reanimated.View
          pointerEvents="box-none"
          className="absolute left-0 right-0 flex-row items-center justify-between"
          style={transparentHeaderStyle}
        >
          <RecipeTransparentHeader onMoreClick={onMoreClick} />
        </Reanimated.View>

        {/* 화이트 헤더(닿은 뒤 일정 거리에서 0→1 등장) */}
        <View
          pointerEvents="box-none"
          className="absolute inset-x-0 top-0 justify-end"
          style={{ paddingTop: insets.top, height: HEADER_MIN_HEIGHT }}
        >
          <Reanimated.View
            className="absolute inset-0 bg-white"
            style={headerBgStyle}
          />

          <Reanimated.View style={headerContentStyle}>
            <Header
              title={recipeDetail?.title ?? ""}
              titleColor="black"
              rightButtonIcons={[
                <IC_MORE key="more" width={24} height={24} color="#3F4542" />,
              ]}
              onBackClick={() => router.back()}
              onRightButtonClick={onMoreClick}
              className="bg-transparent"
            />
          </Reanimated.View>
        </View>

        <RecipeMoreMenu
          visible={isMoreMenuVisible}
          onClose={onCloseMoreMenu}
          onReport={onReportButtonPress}
          onDelete={onDelete}
          isMyRecipe={isMyRecipe}
        />
      </View>

      {recipeDetail?.id && (
        <View className="absolute bottom-0 left-0 right-0">{Footer}</View>
      )}

      {isReportDialogVisible && (
        <ReportRecipeDialog
          visible={isReportDialogVisible}
          onClose={onCloseReportDialog}
          onConfirm={onReportConfirm}
        />
      )}

      {isDeleteDialogVisible && (
        <DeleteRecipeDialog
          visible={isDeleteDialogVisible}
          onClose={onCloseDeleteDialog}
          onConfirm={onDeleteConfirm}
        />
      )}
    </>
  );
}
