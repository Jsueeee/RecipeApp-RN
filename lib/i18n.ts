import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import ko from "../translations/ko";

const i18n = new I18n({
  ko,
  //   en, // 나중에 다국어 적용
});

// 기본 언어 설정
i18n.defaultLocale = "ko";

// 현재 디바이스 언어 가져오기 (기본 한국어)
i18n.locale = getLocales()[0].languageCode ?? "ko";

// 번역 문구가 없을 때 기본 언어로 폴백
i18n.enableFallback = true;

export default i18n;
