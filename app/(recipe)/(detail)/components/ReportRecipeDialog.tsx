import { ChoiceDialog } from "@/components/ChoiceDialog";
import { UnscaledModalRoot } from "@/components/UnscaledModalRoot";
import i18n from "@/lib/i18n";
import React from "react";

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ReportRecipeDialog = ({ visible, onClose, onConfirm }: Props) => {
  return (
    <UnscaledModalRoot>
      <ChoiceDialog
        visible={visible}
        title={i18n.t("recipe_detail.report_dialog_title")}
        message={i18n.t("recipe_detail.report_dialog_desc")}
        confirmText={i18n.t("recipe_detail.report_dialog_confirm")}
        cancelText={i18n.t("recipe_detail.report_dialog_cancel")}
        onCancel={onClose}
        onConfirm={onConfirm}
      />
    </UnscaledModalRoot>
  );
};
