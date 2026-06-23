import { useLoginRequiredDialog } from "@/app/components/LoginRequiredDialogProvider";
import { useCallback } from "react";

export const useLoginPrompt = () => {
  const { showLoginRequiredDialog } = useLoginRequiredDialog();

  return useCallback(() => {
    showLoginRequiredDialog();
  }, [showLoginRequiredDialog]);
};
