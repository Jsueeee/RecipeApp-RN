import { File } from "expo-file-system";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import type { ImageResult } from "expo-image-manipulator";
import type { ImagePickerAsset } from "expo-image-picker";

const RECIPE_IMAGE_MAX_DIMENSION = 1600; // 1400, 1200
const RECIPE_IMAGE_COMPRESS_QUALITY = 0.82; // 0.78, 0.72

type ResizeTarget = { width: number } | { height: number };

const getFileSize = (uri: string): number | null => {
  try {
    const info = new File(uri).info();

    return info.exists && typeof info.size === "number" ? info.size : null;
  } catch (error) {
    console.warn("[RecipeImage] 파일 크기 확인 실패:", error);

    return null;
  }
};

const formatBytes = (bytes: number | null): string => {
  if (bytes === null) return "unknown";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

const getSavingsLabel = (
  originalSize: number | null,
  optimizedSize: number | null,
): string => {
  if (originalSize === null || optimizedSize === null || originalSize <= 0) {
    return "saved=unknown";
  }

  const diff = originalSize - optimizedSize;
  const percent = Math.abs(diff / originalSize) * 100;

  if (diff < 0) {
    return `increased=${formatBytes(Math.abs(diff))} (${percent.toFixed(1)}%)`;
  }

  return `saved=${formatBytes(diff)} (${percent.toFixed(1)}%)`;
};

const logRecipeImageOptimization = (
  asset: ImagePickerAsset,
  result: ImageResult,
) => {
  if (!__DEV__) return;

  const originalSize =
    typeof asset.fileSize === "number"
      ? asset.fileSize
      : getFileSize(asset.uri);
  const optimizedSize = getFileSize(result.uri);

  console.log(
    [
      "🔥이미지 리사이징 확인🔥",
      `original=${formatBytes(originalSize)} (${asset.width}x${asset.height})`,
      `optimized=${formatBytes(optimizedSize)} (${result.width}x${result.height})`,
      getSavingsLabel(originalSize, optimizedSize),
    ].join(" "),
  );
};

const getResizeTarget = (
  width: number,
  height: number,
): ResizeTarget | null => {
  if (width <= 0 || height <= 0) return null;

  const longestSide = Math.max(width, height);

  if (longestSide <= RECIPE_IMAGE_MAX_DIMENSION) return null;

  return width >= height
    ? { width: RECIPE_IMAGE_MAX_DIMENSION }
    : { height: RECIPE_IMAGE_MAX_DIMENSION };
};

export const optimizeRecipeThumbnail = async (
  asset: ImagePickerAsset,
): Promise<string> => {
  const resizeTarget = getResizeTarget(asset.width, asset.height);
  let context = ImageManipulator.manipulate(asset.uri);

  if (resizeTarget) {
    context = context.resize(resizeTarget);
  }

  const image = await context.renderAsync();
  const result = await image.saveAsync({
    compress: RECIPE_IMAGE_COMPRESS_QUALITY,
    format: SaveFormat.JPEG,
  });

  logRecipeImageOptimization(asset, result);

  return result.uri;
};
