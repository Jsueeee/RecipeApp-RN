import { useNativeAdSlots } from "@/app/hooks/useNativeAdSlots";
import { getSearchKeywordNativeAdUnitId } from "@/app/lib/ads/adUnits";
import { useTutorial } from "@/app/tutorial";
import { Text, View } from "react-native";
import {
  NativeAdView,
  NativeAsset,
  NativeAssetType,
} from "react-native-google-mobile-ads";

export function SearchKeywordNativeAd() {
  const { state } = useTutorial();
  const isTutorialVisible = state.phase !== "idle" && state.phase !== "done";
  const adUnitId = getSearchKeywordNativeAdUnitId();
  const nativeAds = useNativeAdSlots({
    cacheKey: `search-keywords:${adUnitId ?? "disabled"}`,
    count: isTutorialVisible ? 0 : 1,
    adUnitId,
  });
  const nativeAd = nativeAds[0];

  if (!nativeAd || isTutorialVisible) return null;

  return (
    <View className="mx-4 mb-6 mt-8">
      <NativeAdView
        nativeAd={nativeAd}
        style={{
          width: "100%",
          height: 64,
          backgroundColor: "transparent",
        }}
      >
        <View className="justify-center rounded-[16px] bg-fill-subtle p-4">
          <View className="w-full justify-center">
            <View className="mb-1 flex-row items-center gap-1.5">
              <View className="rounded bg-white px-1.5 py-0.5">
                <Text className="text-utility5 font-bold text-text-assistive">
                  AD
                </Text>
              </View>

              <NativeAsset assetType={NativeAssetType.HEADLINE}>
                <Text
                  className="flex-1 text-body3 text-text-normal"
                  numberOfLines={1}
                >
                  {nativeAd.headline}
                </Text>
              </NativeAsset>
            </View>

            {nativeAd.advertiser ? (
              <NativeAsset assetType={NativeAssetType.ADVERTISER}>
                <Text
                  className="mt-1 text-caption1 text-text-disable"
                  numberOfLines={1}
                >
                  {nativeAd.advertiser}
                </Text>
              </NativeAsset>
            ) : null}
          </View>
        </View>
      </NativeAdView>
    </View>
  );
}
