import { useGetAppVersion } from "@/app/hooks/queries/useGetAppVersion";
import { useEffect, useState } from "react";
import {
  getCurrentAppVersion,
  isVersionGreaterOrEqual,
} from "../utils/VersionUtils";

export const useVersionCheck = () => {
  const { minimumAppVersion } = useGetAppVersion();
  const [isShowUpdateDialog, setIsShowUpdateDialog] = useState(false);

  const currentVersion = getCurrentAppVersion();
  const needsUpdate = minimumAppVersion
    ? !isVersionGreaterOrEqual(currentVersion, minimumAppVersion)
    : false;

  useEffect(() => {
    if (needsUpdate) {
      setIsShowUpdateDialog(true);
    }
  }, [needsUpdate, currentVersion, minimumAppVersion]);

  return {
    isShowUpdateDialog,
  };
};
