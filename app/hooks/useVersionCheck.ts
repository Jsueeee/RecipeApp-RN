import { useGetAppVersion } from "@/app/hooks/queries/useGetAppVersion";
import { useEffect, useState } from "react";
import {
  getCurrentAppVersion,
  isVersionGreaterOrEqual,
} from "../utils/VersionUtils";

export const useVersionCheck = () => {
  const { minimumAppVersion, isError, isLoading } = useGetAppVersion();
  const [isShowUpdateDialog, setIsShowUpdateDialog] = useState<
    boolean | undefined
  >(undefined);

  const currentVersion = getCurrentAppVersion();
  const needsUpdate = minimumAppVersion
    ? !isVersionGreaterOrEqual(currentVersion, minimumAppVersion)
    : false;

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (needsUpdate) {
      setIsShowUpdateDialog(true);
      return;
    }

    setIsShowUpdateDialog(false);
  }, [isLoading, needsUpdate, currentVersion, minimumAppVersion]);

  return {
    isShowUpdateDialog,
    isErrorAppVersion: isError,
  };
};
