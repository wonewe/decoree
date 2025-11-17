import { useCallback, useEffect, useState } from "react";

/**
 * 이미지 파일 업로드 및 미리보기를 관리하는 커스텀 훅
 */
export function useImageUpload(existingUrl?: string) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const revokePreviewUrl = useCallback((url: string | null) => {
    if (url && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setFile(null);
    setPreview((prev) => {
      revokePreviewUrl(prev);
      return null;
    });
  }, [revokePreviewUrl]);

  const applyFile = useCallback((newFile: File | null) => {
    setFile(newFile);
    setPreview((prev) => {
      revokePreviewUrl(prev);
      if (!newFile) {
        return null;
      }
      return URL.createObjectURL(newFile);
    });
  }, [revokePreviewUrl]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      revokePreviewUrl(preview);
    };
  }, [preview, revokePreviewUrl]);

  // existingUrl이 변경되면 preview 업데이트 (파일이 선택되지 않은 경우에만)
  useEffect(() => {
    if (!file && existingUrl) {
      setPreview(existingUrl);
    } else if (!file && !existingUrl) {
      setPreview(null);
    }
  }, [existingUrl, file]);

  // 현재 미리보기 URL (파일이 선택되면 파일의 blob URL, 없으면 기존 URL)
  const currentPreview = preview ?? existingUrl ?? null;

  return {
    file,
    preview: currentPreview,
    clearSelection,
    applyFile
  };
}

