import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
} from "react-native-google-mobile-ads";

interface Props {
  nativeAd: NativeAd;
}

export function NativeAdListItem({ nativeAd }: Props) {
  return (
    <NativeAdView
      nativeAd={nativeAd}
      style={{
        width: "100%",
        height: 160,
        backgroundColor: "white",
      }}
    >
      <View className="flex-row px-4 py-5">
        <View className="w-[120px] h-[120px] rounded-[12px] bg-gray-50 overflow-hidden mr-4">
          <NativeMediaView
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </View>

        <View className="flex-1 justify-between">
          <View>
            <View className="flex-row items-center gap-2 mb-1">
              <View className="bg-gray-100 px-1.5 py-0.5 rounded">
                <Text className="text-[10px] font-bold text-gray-500">AD</Text>
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

          <View className="flex-row items-center justify-between mt-2">
            <NativeAsset assetType={NativeAssetType.ADVERTISER}>
              <Text
                className="text-caption1 text-gray-400 flex-1 mr-2"
                numberOfLines={1}
              >
                {nativeAd.advertiser}
              </Text>
            </NativeAsset>

            <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
              <TouchableOpacity className="bg-primary-normal px-2 py-1.5 rounded-[8px]">
                <Text className="text-caption1 font-bold text-white">
                  {nativeAd.callToAction}
                </Text>
              </TouchableOpacity>
            </NativeAsset>
          </View>
        </View>
      </View>
    </NativeAdView>
  );
}
