import { File } from "expo-file-system";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import type { ImageResult } from "expo-image-manipulator";
import type { ImagePickerAsset } from "expo-image-picker";
import { Platform } from "react-native";

const RECIPE_IMAGE_MAX_DIMENSION = 1600; // 1400, 1200
const RECIPE_IMAGE_COMPRESS_QUALITY = 0.82; // 0.78, 0.72
const ULTRA_HDR_SCAN_BYTES = 64 * 1024;
const ULTRA_HDR_XMP_MARKER = 'hdrgm:Version="1.0"';

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

const containsAscii = (bytes: Uint8Array, value: string): boolean => {
  const lastStartIndex = bytes.length - value.length;

  for (let startIndex = 0; startIndex <= lastStartIndex; startIndex++) {
    let isMatch = true;

    for (let valueIndex = 0; valueIndex < value.length; valueIndex++) {
      if (bytes[startIndex + valueIndex] !== value.charCodeAt(valueIndex)) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) return true;
  }

  return false;
};

const isUltraHdrImage = (uri: string): boolean => {
  if (Platform.OS !== "android") return false;

  let handle: ReturnType<File["open"]> | null = null;

  try {
    const file = new File(uri);
    handle = file.open();
    const bytesToRead = Math.min(handle.size ?? 0, ULTRA_HDR_SCAN_BYTES);

    if (bytesToRead === 0) return false;

    return containsAscii(handle.readBytes(bytesToRead), ULTRA_HDR_XMP_MARKER);
  } catch (error) {
    console.warn("[RecipeImage] Ultra HDR 확인 실패:", error);
    return false;
  } finally {
    handle?.close();
  }
};

const convertUltraHdrToSdrPng = async (
  uri: string,
  resizeTarget: ResizeTarget | null,
): Promise<ImageResult> => {
  let context = ImageManipulator.manipulate(uri);

  if (resizeTarget) {
    context = context.resize(resizeTarget);
  }

  const image = await context.renderAsync();

  // PNG는 HDR gain map을 저장하지 않으므로 일반 SDR 이미지로 정규화된다.
  return image.saveAsync({
    compress: 1,
    format: SaveFormat.PNG,
  });
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
  didNormalizeUltraHdr: boolean,
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
      `ultraHdrNormalized=${didNormalizeUltraHdr}`,
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
  const didNormalizeUltraHdr = isUltraHdrImage(asset.uri);
  let normalizedFile: File | null = null;

  try {
    const originalResizeTarget = getResizeTarget(asset.width, asset.height);
    const source = didNormalizeUltraHdr
      ? await convertUltraHdrToSdrPng(asset.uri, originalResizeTarget)
      : { uri: asset.uri, width: asset.width, height: asset.height };

    if (didNormalizeUltraHdr) {
      normalizedFile = new File(source.uri);
    }

    const resizeTarget = getResizeTarget(source.width, source.height);
    let context = ImageManipulator.manipulate(source.uri);

    if (resizeTarget) {
      context = context.resize(resizeTarget);
    }

    const image = await context.renderAsync();
    const result = await image.saveAsync({
      compress: RECIPE_IMAGE_COMPRESS_QUALITY,
      format: SaveFormat.JPEG,
    });

    logRecipeImageOptimization(asset, result, didNormalizeUltraHdr);

    return result.uri;
  } finally {
    try {
      if (normalizedFile?.exists) normalizedFile.delete();
    } catch (error) {
      console.warn("[RecipeImage] 중간 이미지 삭제 실패:", error);
    }
  }
};
