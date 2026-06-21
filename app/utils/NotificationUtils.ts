import { apiClient } from "@/app/lib/api/client";
import { authStorage } from "@/app/lib/storage/auth";
import {
  AuthorizationStatus,
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
let pendingFcmTokenSync: Promise<void> | null = null;

const FCM_TOKEN_RETRY_COUNT = 3;
const FCM_TOKEN_RETRY_DELAY_MS = 1500;

const isMessagingSupportedPlatform = () => {
  return Platform.OS === "android" || Platform.OS === "ios";
};

const delay = (milliseconds: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
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

export const syncFcmToken = async (token: string) => {
  if (!token) {
    return;
  }

  if (pendingFcmTokenSync) {
    await pendingFcmTokenSync.catch(() => {});
  }

  pendingFcmTokenSync = (async () => {
    try {
      const accessToken = await authStorage.getAccessToken();

      if (!accessToken) {
        return;
      }

      await apiClient.patch("/users/fcm-token", {
        fcmToken: token,
      });
    } catch (error) {
      if (__DEV__) {
        console.warn("[Notifications] failed to sync FCM token", error);
      }
    }
  })().finally(() => {
    pendingFcmTokenSync = null;
  });

  await pendingFcmTokenSync;
};

export const syncCurrentFcmToken = async () => {
  const accessToken = await authStorage.getAccessToken();

  if (!accessToken) {
    return;
  }

  const token = await getFcmToken();
  await syncFcmToken(token);
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
