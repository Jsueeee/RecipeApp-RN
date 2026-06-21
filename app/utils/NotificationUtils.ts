import { apiClient } from "@/app/lib/api/client";
import { authStorage } from "@/app/lib/storage/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AuthorizationStatus,
  deleteToken,
  getMessaging,
  getToken,
  hasPermission,
  isDeviceRegisteredForRemoteMessages,
  onTokenRefresh,
  registerDeviceForRemoteMessages,
  requestPermission,
} from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";

let cachedFcmToken: string | null = null;
let pendingFcmTokenRequest: Promise<string> | null = null;
let pendingFcmTokenSync: Promise<boolean> | null = null;
let isFcmTokenSyncPaused = false;

const FCM_TOKEN_RETRY_COUNT = 3;
const FCM_TOKEN_RETRY_DELAY_MS = 1500;
const EXPIRATION_NOTIFICATION_ENABLED_KEY =
  "settings:expiration_notification_enabled";

const isMessagingSupportedPlatform = () => {
  return Platform.OS === "android" || Platform.OS === "ios";
};

const delay = (milliseconds: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

export const getExpirationNotificationEnabled = async () => {
  try {
    const value = await AsyncStorage.getItem(EXPIRATION_NOTIFICATION_ENABLED_KEY);
    return value !== "false";
  } catch (error) {
    if (__DEV__) {
      console.warn(
        "[Notifications] failed to read expiration notification setting",
        error,
      );
    }

    return true;
  }
};

const saveExpirationNotificationEnabled = async (isEnabled: boolean) => {
  try {
    await AsyncStorage.setItem(
      EXPIRATION_NOTIFICATION_ENABLED_KEY,
      String(isEnabled),
    );
    return true;
  } catch (error) {
    if (__DEV__) {
      console.warn(
        "[Notifications] failed to save expiration notification setting",
        error,
      );
    }

    return false;
  }
};

const isMessagingPermissionGranted = (status: number) => {
  return (
    status === AuthorizationStatus.AUTHORIZED ||
    status === AuthorizationStatus.PROVISIONAL
  );
};

const requestAndroidNotificationPermission = async () => {
  if (Platform.OS !== "android") {
    return true;
  }

  if (Number(Platform.Version) < 33) {
    return true;
  }

  const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
  const alreadyGranted = await PermissionsAndroid.check(permission);

  if (alreadyGranted) {
    return true;
  }

  const result = await PermissionsAndroid.request(permission);
  return result === PermissionsAndroid.RESULTS.GRANTED;
};

export const isNotificationPermissionGranted = async () => {
  try {
    if (!isMessagingSupportedPlatform()) {
      return false;
    }

    if (Platform.OS === "android") {
      if (Number(Platform.Version) < 33) {
        return true;
      }

      return PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }

    const currentStatus = await hasPermission(getMessaging());
    return isMessagingPermissionGranted(currentStatus);
  } catch (error) {
    if (__DEV__) {
      console.warn("[Notifications] failed to check permission", error);
    }

    return false;
  }
};

export const requestNotificationPermission = async () => {
  try {
    if (!isMessagingSupportedPlatform()) {
      return false;
    }

    if (Platform.OS === "android") {
      return requestAndroidNotificationPermission();
    }

    const messaging = getMessaging();
    const currentStatus = await hasPermission(messaging);

    if (isMessagingPermissionGranted(currentStatus)) {
      return true;
    }

    if (currentStatus === AuthorizationStatus.DENIED) {
      return false;
    }

    const nextStatus = await requestPermission(messaging, {
      alert: true,
      badge: true,
      sound: true,
    });

    return isMessagingPermissionGranted(nextStatus);
  } catch (error) {
    if (__DEV__) {
      console.warn("[Notifications] failed to request permission", error);
    }

    return false;
  }
};

const prepareMessaging = async () => {
  const hasNotificationPermission = await requestNotificationPermission();

  if (!hasNotificationPermission) {
    return false;
  }

  const messaging = getMessaging();

  if (!isDeviceRegisteredForRemoteMessages(messaging)) {
    await registerDeviceForRemoteMessages(messaging);
  }

  return true;
};

const fetchFcmToken = async () => {
  if (!isMessagingSupportedPlatform()) {
    return "";
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= FCM_TOKEN_RETRY_COUNT; attempt += 1) {
    try {
      const isMessagingReady = await prepareMessaging();

      if (!isMessagingReady) {
        return "";
      }

      const token = await getToken(getMessaging());
      return token;
    } catch (error) {
      lastError = error;

      if (attempt < FCM_TOKEN_RETRY_COUNT) {
        await delay(FCM_TOKEN_RETRY_DELAY_MS);
      }
    }
  }

  if (__DEV__) {
    console.warn("[Notifications] failed to get FCM token", lastError);
  }

  return "";
};

export const getFcmToken = async () => {
  if (cachedFcmToken) {
    return cachedFcmToken;
  }

  if (pendingFcmTokenRequest) {
    return pendingFcmTokenRequest;
  }

  pendingFcmTokenRequest = fetchFcmToken();
  const token = await pendingFcmTokenRequest;
  pendingFcmTokenRequest = null;

  if (token) {
    cachedFcmToken = token;
  }

  return token;
};

const patchFcmToken = async (token: string) => {
  if (pendingFcmTokenSync) {
    await pendingFcmTokenSync.catch(() => {});
  }

  pendingFcmTokenSync = (async () => {
    try {
      const accessToken = await authStorage.getAccessToken();

      if (!accessToken) {
        return true;
      }

      await apiClient.patch("/users/fcm-token", {
        fcmToken: token,
      });

      return true;
    } catch (error) {
      if (__DEV__) {
        console.warn("[Notifications] failed to sync FCM token", error);
      }

      return false;
    }
  })().finally(() => {
    pendingFcmTokenSync = null;
  });

  return pendingFcmTokenSync;
};

export const syncFcmToken = async (token: string) => {
  if (isFcmTokenSyncPaused) {
    return false;
  }

  if (!token) {
    return false;
  }

  const isNotificationEnabled = await getExpirationNotificationEnabled();

  if (!isNotificationEnabled) {
    return false;
  }

  return patchFcmToken(token);
};

export const syncCurrentFcmToken = async () => {
  const accessToken = await authStorage.getAccessToken();

  if (!accessToken) {
    return false;
  }

  const isNotificationEnabled = await getExpirationNotificationEnabled();

  if (!isNotificationEnabled) {
    return false;
  }

  const token = await getFcmToken();
  return syncFcmToken(token);
};

const deleteDeviceFcmToken = async () => {
  if (!isMessagingSupportedPlatform()) {
    return true;
  }

  try {
    await deleteToken(getMessaging());
    cachedFcmToken = null;
    pendingFcmTokenRequest = null;
    return true;
  } catch (error) {
    if (__DEV__) {
      console.warn("[Notifications] failed to delete FCM token", error);
    }

    return false;
  }
};

export const resumeFcmTokenSync = () => {
  isFcmTokenSyncPaused = false;
};

export const clearSyncedFcmToken = async (options?: {
  keepSyncPaused?: boolean;
}) => {
  isFcmTokenSyncPaused = true;

  const didClearServerToken = await patchFcmToken("");
  const didDeleteDeviceToken = await deleteDeviceFcmToken();

  if (!options?.keepSyncPaused) {
    resumeFcmTokenSync();
  }

  return didClearServerToken || didDeleteDeviceToken;
};

export const updateExpirationNotificationEnabled = async (
  isEnabled: boolean,
) => {
  const didSaveSetting = await saveExpirationNotificationEnabled(isEnabled);

  if (!didSaveSetting) {
    return false;
  }

  if (!isEnabled) {
    const didClearToken = await clearSyncedFcmToken();

    if (!didClearToken) {
      await saveExpirationNotificationEnabled(true);
    }

    return didClearToken;
  }

  const accessToken = await authStorage.getAccessToken();

  if (!accessToken) {
    return true;
  }

  const didSyncToken = await syncCurrentFcmToken();

  if (!didSyncToken) {
    await saveExpirationNotificationEnabled(false);
  }

  return didSyncToken;
};

export const registerFcmTokenRefreshSync = () => {
  if (!isMessagingSupportedPlatform()) {
    return () => {};
  }

  return onTokenRefresh(getMessaging(), (token) => {
    cachedFcmToken = token;
    void syncFcmToken(token);
  });
};
