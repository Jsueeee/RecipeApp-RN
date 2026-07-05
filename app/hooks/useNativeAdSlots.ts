import { useEffect, useMemo, useReducer, useRef } from "react";
import { NativeAd } from "react-native-google-mobile-ads";

import { getNativeAdUnitId } from "@/app/lib/ads/adUnits";

interface UseNativeAdSlotsParams {
  cacheKey: string;
  count: number;
}

export function useNativeAdSlots({ cacheKey, count }: UseNativeAdSlotsParams) {
  const adsRef = useRef<NativeAd[]>([]);
  const cacheKeyRef = useRef(cacheKey);
  const [adVersion, refreshAds] = useReducer(
    (version: number) => version + 1,
    0,
  );

  useEffect(() => {
    if (cacheKeyRef.current === cacheKey) {
      return;
    }

    adsRef.current.forEach((ad) => ad.destroy());
    adsRef.current = [];
    cacheKeyRef.current = cacheKey;
    refreshAds();
  }, [cacheKey]);

  useEffect(() => {
    if (count <= adsRef.current.length) {
      return;
    }

    const adUnitId = getNativeAdUnitId();

    if (!adUnitId) {
      return;
    }

    let isCancelled = false;

    const loadMissingAds = async () => {
      const adsToLoad = count - adsRef.current.length;

      for (let i = 0; i < adsToLoad; i++) {
        try {
          const ad = await NativeAd.createForAdRequest(adUnitId);

          if (isCancelled || cacheKeyRef.current !== cacheKey) {
            ad.destroy();
            return;
          }

          adsRef.current.push(ad);
          refreshAds();
        } catch (error) {
          console.error("Ad load failed", error);
        }

        if (isCancelled || cacheKeyRef.current !== cacheKey) {
          return;
        }
      }
    };

    loadMissingAds();

    return () => {
      isCancelled = true;
    };
  }, [cacheKey, count]);

  useEffect(() => {
    return () => {
      adsRef.current.forEach((ad) => ad.destroy());
      adsRef.current = [];
    };
  }, []);

  return useMemo(() => {
    if (cacheKeyRef.current !== cacheKey) {
      return [];
    }

    return adsRef.current.slice(0, count);
  }, [cacheKey, count, adVersion]);
}
