import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import type { SupportedLanguage } from "../shared/i18n";
import { getFirebaseApp } from "./firebase";
import { STATIC_CONTENT_MODE } from "./repositories/runtimeConfig";

type UploadAdminAssetOptions = {
  collection: "events" | "trends" | "phrases" | "popups" | (string & {});
  entityId?: string;
  language?: SupportedLanguage;
  assetType?: string;
};

function sanitizeSegment(segment: string | undefined) {
  if (!segment) return undefined;
  return segment.trim().toLowerCase().replace(/[^a-z0-9-_]/gi, "-");
}

let storageInstance: ReturnType<typeof getStorage> | null = null;

function getStorageInstance() {
  if (storageInstance) return storageInstance;
  const app = getFirebaseApp();
  
  // Try to get bucket from app config first, then fallback to env variable
  const appConfig = app.options;
  const storageBucket = appConfig.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
  
  if (!storageBucket) {
    throw new Error(
      "Firebase Storage bucket is not configured. Please set VITE_FIREBASE_STORAGE_BUCKET in your .env file. " +
      "The bucket name can be in the format: your-project-id.appspot.com or your-project-id.firebasestorage.app"
    );
  }
  
  // If bucket is already in app config, getStorage(app) will use it automatically
  // But we explicitly pass it to be safe
  storageInstance = getStorage(app, storageBucket);
  return storageInstance;
}

function buildStoragePath(options: UploadAdminAssetOptions, fileName: string) {
  const segments = ["studio", options.collection];
  const sanitizedId = sanitizeSegment(options.entityId);
  if (sanitizedId) {
    segments.push(sanitizedId);
  }
  const sanitizedAsset = sanitizeSegment(options.assetType);
  if (sanitizedAsset) {
    segments.push(sanitizedAsset);
  }
  const sanitizedLang = sanitizeSegment(options.language);
  if (sanitizedLang) {
    segments.push(sanitizedLang);
  }
  segments.push(fileName);
  return segments.join("/");
}

function createFileName(originalName: string) {
  const extension = originalName.includes(".")
    ? `.${originalName.split(".").pop()?.toLowerCase() ?? ""}`
    : "";
  const prefix = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${randomSuffix}${extension}`;
}

export async function uploadAdminAsset(file: File, options: UploadAdminAssetOptions) {
  if (STATIC_CONTENT_MODE) {
    throw new Error("이미지 업로드를 사용하려면 Firebase 구성이 필요합니다.");
  }

  if (!file) {
    throw new Error("업로드할 파일이 선택되지 않았습니다.");
  }

  const storage = getStorageInstance();
  const safeFileName = createFileName(file.name || "asset");
  const path = buildStoragePath(options, safeFileName);
  const storageRef = ref(storage, path);

  const metadata = file.type
    ? {
        contentType: file.type,
        cacheControl: "public,max-age=31536000,immutable"
      }
    : undefined;

  await uploadBytes(storageRef, file, metadata);
  const downloadUrl = await getDownloadURL(storageRef);

  return {
    downloadUrl,
    path
  };
}

