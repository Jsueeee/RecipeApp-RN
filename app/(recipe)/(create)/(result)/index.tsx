import { CTAButton } from "@/components/CTAButton";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
  TestIds,
} from "react-native-google-mobile-ads";

export default function CreateRecipeResultScreen() {
  const nativeAdRef = useRef<NativeAd | null>(null);
  const [loaded, setLoaded] = useState(false);

  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loaded) {
      Animated.stagger(200, [
        Animated.timing(anim1, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(anim2, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(anim3, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loaded]);

  const getAnimStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  });

  useEffect(() => {
    let isMounted = true;

    const loadAd = async () => {
      try {
        const ad = await NativeAd.createForAdRequest(TestIds.NATIVE, {
          requestNonPersonalizedAdsOnly: true,
        });

        if (isMounted) {
          nativeAdRef.current = ad;
          setLoaded(true);
        }
      } catch (error) {
        console.error("Ad load failed", error);
      }
    };

    loadAd();

    return () => {
      isMounted = false;
    };
  }, []);

  const nativeAd = nativeAdRef.current;

  const onPressCTAButton = () => {
    router.push({
      pathname: "/(myPage)/(myRecipe)",
    });
  };

  return (
    <ScreenLayout>
      {nativeAd && loaded ? (
        <>
          <NativeAdView
            nativeAd={nativeAd}
            style={{
              width: "100%",
              backgroundColor: "white",
              alignContent: "center",
            }}
          >
            <View className="px-4 py-5 h-[450px] gap-4">
              <View className="w-full max-w-[384px] rounded-[12px] bg-gray-50 overflow-hidden mr-4">
                <NativeMediaView
                  resizeMode="cover"
                  style={{ width: "100%", aspectRatio: 4 / 3 }}
                />
              </View>

              <View className="justify-between gap-4">
                <View>
                  <View className="flex-row items-center gap-2 mb-1">
                    <View className="bg-gray-100 px-1.5 py-0.5 rounded">
                      <Text className="text-[10px] font-bold text-gray-500">
                        AD
                      </Text>
                    </View>
                    <NativeAsset assetType={NativeAssetType.HEADLINE}>
                      <Text
                        className="text-base font-bold text-gray-900"
                        numberOfLines={1}
                      >
                        {nativeAd.headline}
                      </Text>
                    </NativeAsset>
                  </View>

                  <NativeAsset assetType={NativeAssetType.BODY}>
                    <Text
                      className="text-body4 text-text-assistive"
                      numberOfLines={2}
                    >
                      {nativeAd.body}
                    </Text>
                  </NativeAsset>
                </View>

                <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
                  <TouchableOpacity className="bg-fill-normal px-4 py-3 rounded-[8px] self-end">
                    <Text className="text-caption1 font-bold text-white">
                      {nativeAd.callToAction}
                    </Text>
                  </TouchableOpacity>
                </NativeAsset>
              </View>
            </View>
          </NativeAdView>

          <Animated.Text
            className="text-heading1 text-text-normal self-center"
            style={getAnimStyle(anim1)}
          >
            볶음 우동
          </Animated.Text>
          <Animated.Text
            className="text-heading1 text-text-normal self-center"
            style={getAnimStyle(anim2)}
          >
            레시피 완성!
          </Animated.Text>

          <Animated.Text
            className="text-body1 text-text-assistive self-center mt-4"
            style={getAnimStyle(anim3)}
          >
            10번째 레시피 완성을 축하드려요 🎉
          </Animated.Text>

          <View className="flex-1" />

          <CTAButton
            buttonLabel={i18n.t("recipe_my_create_result.cta")}
            onPress={onPressCTAButton}
            className="w-full px-4 pb-[22px] pt-4"
          />
        </>
      ) : (
        <DotLoadingScreen />
      )}
    </ScreenLayout>
  );
}
