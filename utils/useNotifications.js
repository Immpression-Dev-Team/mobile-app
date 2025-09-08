// utils/useNotifications.js
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { AppState } from "react-native";
import {
  getNotifications,
  getUnreadNotificationsCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "../API/API"; // ✅ import from your API.js file

const PAGE_LIMIT = 20;
const POLL_MS = 30000; // 30s

export function useNotifications(token) {
  console.log("🟢 useNotifications hook called with token:", token ? "Present" : "Missing");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);          // initial/refresh
  const [loadingMore, setLoadingMore] = useState(false);  // pagination
  const [refreshing, setRefreshing] = useState(false);    // pull-to-refresh

  const pollRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  // Merge page results without duplicates; keep createdAt desc
  const mergePage = useCallback((pageItems) => {
    setNotifications((prev) => {
      const seen = new Map(prev.map((n) => [n.id, n]));
      for (const n of pageItems) {
        seen.set(n.id, { ...(seen.get(n.id) || {}), ...n });
      }
      return Array.from(seen.values()).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    });
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    if (!token) {
      console.log("🔔 No token for fetchUnreadCount");
      return;
    }
    console.log("🔔 Fetching unread count...");
    try {
      const res = await getUnreadNotificationsCount(token);
      console.log("🔔 Unread count response:", res);
      if (res?.success) setUnreadCount(res.data?.count ?? 0);
    } catch (err) {
      console.error("🔔 Failed to fetch unread count:", err.message);
    }
  }, [token]);

  // Page fetcher (cursor-based)
  const fetchPage = useCallback(
    async ({ after } = {}) => {
      if (!token) {
        console.log("🔔 No token for fetchPage");
        return { items: [], cursor: null };
      }
      console.log("🔔 Fetching notifications page...", { after });
      try {
        const res = await getNotifications(token, {
          limit: PAGE_LIMIT,
          ...(after ? { after } : {}),
        });
        console.log("🔔 Notifications response:", res);
        // backend returns: { success, data, nextCursor }
        if (res?.success) {
          return { items: res.data || [], cursor: res.nextCursor || null };
        }
      } catch (e) {
        console.error("🔔 getNotifications failed:", e.message);
      }
      return { items: [], cursor: null };
    },
    [token]
  );

  const initialLoad = useCallback(async () => {
    if (!token) {
      console.log("🔔 No token for initialLoad");
      return;
    }
    console.log("🔔 Starting initial notifications load...");
    setLoading(true);
    try {
      const { items, cursor } = await fetchPage();
      console.log("🔔 Setting notifications:", items.length, "items");
      setNotifications(items);
      setNextCursor(cursor);
      await fetchUnreadCount();
    } finally {
      setLoading(false);
    }
  }, [token, fetchPage, fetchUnreadCount]);

  const refresh = useCallback(async () => {
    if (!token) {
      console.log("🔔 No token for refresh");
      return;
    }
    console.log("🔔 Starting refresh...");
    setRefreshing(true);
    try {
      const { items, cursor } = await fetchPage();
      console.log("🔔 Refresh got items:", items.length);
      setNotifications(items);
      setNextCursor(cursor);
      await fetchUnreadCount();
    } finally {
      setRefreshing(false);
      console.log("🔔 Refresh completed");
    }
  }, [token, fetchPage, fetchUnreadCount]);

  const loadMore = useCallback(async () => {
    if (!token || !nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const { items, cursor } = await fetchPage({ after: nextCursor });
      mergePage(items);
      setNextCursor(cursor);
    } finally {
      setLoadingMore(false);
    }
  }, [token, nextCursor, loadingMore, fetchPage, mergePage]);

  // Single mark-as-read (optimistic)
  const markAsRead = useCallback(
    async (id) => {
      if (!token || !id) return;
      // optimistic update
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, readAt: n.readAt || new Date().toISOString() } : n
        )
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      try {
        const res = await markNotificationRead(id, token);
        if (!res?.success) throw new Error("mark read failed");
      } catch (err) {
        console.warn("Mark read failed, rolling back:", err.message);
        await refresh();
      }
    },
    [token, refresh]
  );

  // Mark all as read (optimistic)
  const markAllAsRead = useCallback(async () => {
    if (!token) return;
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() }))
    );
    setUnreadCount(0);
    try {
      const res = await markAllNotificationsRead(token);
      if (!res?.success) throw new Error("mark all read failed");
    } catch (err) {
      console.warn("Mark-all failed, refreshing:", err.message);
      await refresh();
    }
  }, [token, refresh]);

  // initial + polling
  useEffect(() => {
    initialLoad();
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => {
      refresh();
    }, POLL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [initialLoad, refresh]);

  // refresh when app returns to foreground
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      const prev = appStateRef.current;
      appStateRef.current = next;
      if (prev.match(/inactive|background/) && next === "active") {
        refresh();
      }
    });
    return () => sub.remove();
  }, [refresh]);

  // Helpful computed flags
  const hasMore = !!nextCursor;

  return useMemo(
    () => ({
      // data
      notifications,
      unreadCount,
      nextCursor,
      hasMore,
      // states
      loading,
      loadingMore,
      refreshing,
      // actions
      refresh,
      loadMore,
      markAsRead,
      markAllAsRead,
      fetchUnreadCount,
    }),
    [
      notifications,
      unreadCount,
      nextCursor,
      hasMore,
      loading,
      loadingMore,
      refreshing,
      refresh,
      loadMore,
      markAsRead,
      markAllAsRead,
      fetchUnreadCount,
    ]
  );
}
