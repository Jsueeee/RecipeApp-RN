import { router } from "expo-router";

const DEFAULT_NAVIGATION_DEBOUNCE_MS = 700;

let isInstalled = false;
let lastNavigationKey = "";
let lastNavigationAt = 0;

const serializeNavigationArg = (arg: unknown) => {
  if (typeof arg === "string") {
    return arg;
  }

  try {
    return JSON.stringify(arg);
  } catch {
    return String(arg);
  }
};

const shouldRunNavigation = (
  key: string,
  delayMs = DEFAULT_NAVIGATION_DEBOUNCE_MS
) => {
  const now = Date.now();

  if (key === lastNavigationKey && now - lastNavigationAt < delayMs) {
    return false;
  }

  lastNavigationKey = key;
  lastNavigationAt = now;

  return true;
};

export const installNavigationDebounce = (
  delayMs = DEFAULT_NAVIGATION_DEBOUNCE_MS
) => {
  if (isInstalled) {
    return;
  }

  isInstalled = true;

  const originalPush = router.push;
  const originalReplace = router.replace;
  const originalNavigate = router.navigate;
  const originalBack = router.back;
  const originalDismiss = router.dismiss;
  const originalDismissAll = router.dismissAll;

  router.push = ((...args: Parameters<typeof router.push>) => {
    const key = `push:${args.map(serializeNavigationArg).join("|")}`;

    if (!shouldRunNavigation(key, delayMs)) {
      return;
    }

    return originalPush(...args);
  }) as typeof router.push;

  router.replace = ((...args: Parameters<typeof router.replace>) => {
    const key = `replace:${args.map(serializeNavigationArg).join("|")}`;

    if (!shouldRunNavigation(key, delayMs)) {
      return;
    }

    return originalReplace(...args);
  }) as typeof router.replace;

  router.navigate = ((...args: Parameters<typeof router.navigate>) => {
    const key = `navigate:${args.map(serializeNavigationArg).join("|")}`;

    if (!shouldRunNavigation(key, delayMs)) {
      return;
    }

    return originalNavigate(...args);
  }) as typeof router.navigate;

  router.back = ((...args: Parameters<typeof router.back>) => {
    const key = `back:${args.map(serializeNavigationArg).join("|")}`;

    if (!shouldRunNavigation(key, delayMs)) {
      return;
    }

    return originalBack(...args);
  }) as typeof router.back;

  router.dismiss = ((...args: Parameters<typeof router.dismiss>) => {
    const key = `dismiss:${args.map(serializeNavigationArg).join("|")}`;

    if (!shouldRunNavigation(key, delayMs)) {
      return;
    }

    return originalDismiss(...args);
  }) as typeof router.dismiss;

  router.dismissAll = ((
    ...args: Parameters<typeof router.dismissAll>
  ) => {
    const key = `dismissAll:${args.map(serializeNavigationArg).join("|")}`;

    if (!shouldRunNavigation(key, delayMs)) {
      return;
    }

    return originalDismissAll(...args);
  }) as typeof router.dismissAll;
};
