import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";

export const useDefaultBottomSheetModal = () => {
  const ref = useRef<BottomSheetModal | null>(null);

  const open = useCallback(() => {
    ref.current?.present();
  }, []);

  const dismiss = useCallback(() => {
    ref.current?.dismiss();
  }, []);

  return {
    ref,
    open,
    dismiss,
  };
};
