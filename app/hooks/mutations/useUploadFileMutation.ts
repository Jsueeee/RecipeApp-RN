import { apiClient } from "@/app/lib/api/client";
import { useMutation } from "@tanstack/react-query";
import FormData from "form-data";

const uploadFile = async (uri: string): Promise<string> => {
  const fileName = uri.split("/").pop();
  const extension = fileName?.split(".").pop()?.toLowerCase();

  const type =
    extension === "png"
      ? "image/png"
      : extension === "jpg" || extension === "jpeg"
      ? "image/jpeg"
      : extension === "svg"
      ? "image/svg+xml"
      : "application/octet-stream";
  const formData = new FormData();
  formData.append("file", {
    uri,
    name: fileName,
    type,
  });

  const response = await apiClient.post("/file/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const useUploadFileMutation = () => {
  return useMutation({
    mutationFn: uploadFile,
  });
};
