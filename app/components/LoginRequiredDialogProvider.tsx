import { queryClient } from "@/app/lib/query/client";
import { clearGuestFridgeStorage } from "@/app/lib/storage/guestFridge";
import { authStorage } from "@/app/lib/storage/auth";
import { ChoiceDialog } from "@/components/ChoiceDialog";
import i18n from "@/lib/i18n";
import { router } from "expo-router";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type LoginRequiredDialogContextValue = {
  showLoginRequiredDialog: () => void;
};

const LoginRequiredDialogContext =
  createContext<LoginRequiredDialogContextValue | null>(null);

type Props = {
  children: React.ReactNode;
};

export function LoginRequiredDialogProvider({ children }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const showLoginRequiredDialog = useCallback(() => {
    setIsVisible(true);
  }, []);

  const closeDialog = useCallback(() => {
    if (isConfirmLoading) return;
    setIsVisible(false);
  }, [isConfirmLoading]);

  const moveToLogin = useCallback(async () => {
    if (isConfirmLoading) return;

    setIsConfirmLoading(true);
    try {
      await authStorage.clear();
      await clearGuestFridgeStorage();
      queryClient.clear();
      setIsVisible(false);

      router.dismissAll();
      router.replace("/(auth)");
    } finally {
      setIsConfirmLoading(false);
    }
  }, [isConfirmLoading]);

  const contextValue = useMemo(
    () => ({ showLoginRequiredDialog }),
    [showLoginRequiredDialog],
  );

  return (
    <LoginRequiredDialogContext.Provider value={contextValue}>
      {children}

      <ChoiceDialog
        visible={isVisible}
        title={i18n.t("login.required_dialog_title")}
        message={i18n.t("login.required_dialog_message")}
        confirmText={i18n.t("login.required_dialog_confirm")}
        cancelText={i18n.t("login.required_dialog_cancel")}
        isConfirmLoading={isConfirmLoading}
        onConfirm={moveToLogin}
        onCancel={closeDialog}
      />
    </LoginRequiredDialogContext.Provider>
  );
}

export const useLoginRequiredDialog = () => {
  const context = useContext(LoginRequiredDialogContext);

  if (!context) {
    throw new Error(
      "useLoginRequiredDialog must be used within LoginRequiredDialogProvider",
    );
  }

  return context;
};
