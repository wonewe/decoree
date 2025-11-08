import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { useAuth } from "./auth";

export type BookmarkType = "trend" | "event" | "popup";

export type BookmarkItem = {
  id: string;
  type: BookmarkType;
  title: string;
  summary?: string;
  imageUrl?: string;
  location?: string;
  href: string;
  savedAt: string;
};

type BookmarkActionResult = {
  ok: boolean;
  reason?: "auth";
};

type BookmarkContextValue = {
  bookmarks: BookmarkItem[];
  isBookmarked: (type: BookmarkType, id: string) => boolean;
  toggleBookmark: (item: Omit<BookmarkItem, "savedAt">) => BookmarkActionResult;
  removeBookmark: (type: BookmarkType, id: string) => void;
};

const STORAGE_KEY = "decoree:bookmarks";

const BookmarkContext = createContext<BookmarkContextValue | undefined>(undefined);

type BookmarkStore = Record<string, BookmarkItem[]>;

const safeParse = (value: string | null): BookmarkStore => {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value) as BookmarkStore;
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch (error) {
    console.warn("Unable to parse bookmark store", error);
  }
  return {};
};

const readStore = (): BookmarkStore => {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return safeParse(raw);
};

const writeStore = (store: BookmarkStore) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  const currentUserId = user?.uid ?? null;

  useEffect(() => {
    if (!currentUserId) {
      setBookmarks([]);
      return;
    }
    const store = readStore();
    setBookmarks(store[currentUserId] ?? []);
  }, [currentUserId]);

  const persist = useCallback(
    (next: BookmarkItem[]) => {
      if (!currentUserId) return;
      const store = readStore();
      store[currentUserId] = next;
      writeStore(store);
      setBookmarks(next);
    },
    [currentUserId]
  );

  const isBookmarked = useCallback(
    (type: BookmarkType, id: string) => {
      return bookmarks.some((bookmark) => bookmark.type === type && bookmark.id === id);
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (item: Omit<BookmarkItem, "savedAt">): BookmarkActionResult => {
      if (!currentUserId) {
        return { ok: false, reason: "auth" };
      }
      const exists = isBookmarked(item.type, item.id);
      if (exists) {
        persist(bookmarks.filter((bookmark) => !(bookmark.type === item.type && bookmark.id === item.id)));
        return { ok: true };
      }
      const newBookmark: BookmarkItem = {
        ...item,
        savedAt: new Date().toISOString()
      };
      persist([newBookmark, ...bookmarks]);
      return { ok: true };
    },
    [bookmarks, currentUserId, isBookmarked, persist]
  );

  const removeBookmark = useCallback(
    (type: BookmarkType, id: string) => {
      if (!currentUserId) return;
      persist(bookmarks.filter((bookmark) => !(bookmark.type === type && bookmark.id === id)));
    },
    [bookmarks, currentUserId, persist]
  );

  const value = useMemo<BookmarkContextValue>(
    () => ({
      bookmarks,
      isBookmarked,
      toggleBookmark,
      removeBookmark
    }),
    [bookmarks, isBookmarked, toggleBookmark, removeBookmark]
  );

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarks must be used within BookmarkProvider");
  }
  return context;
}
