"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { useCallback, useState, useEffect } from "react";

// Type definitions for YouTube data
interface YouTubePlaylist {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  videoCount: number;
  privacyStatus: string;
  publishedAt?: string;
  cachedAt: number;
  isStale: boolean;
}

interface YouTubeVideo {
  id: string;
  playlistItemId?: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  channelTitle: string;
  duration?: string;
  position?: number;
  publishedAt?: string;
  cachedAt?: number;
  isStale?: boolean;
  playlistId?: string;
}

interface ConnectionStatus {
  connected: boolean;
  hasTokens?: boolean;
}

// Helper to access youtube api (generated after convex dev runs)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const youtubeApi = (api as any).youtube as Record<string, any> | undefined;

/**
 * Hook to manage YouTube connection status
 */
export function useYoutubeConnection() {
  const connectionStatus = useQuery(
    youtubeApi?.getYoutubeConnectionStatus
  ) as ConnectionStatus | undefined;
  const disconnectMutation = useMutation(youtubeApi?.disconnectYoutube);

  const isConnected = connectionStatus?.connected ?? false;
  const isLoading = connectionStatus === undefined;

  const connect = useCallback(() => {
    window.location.href = "/api/auth/youtube";
  }, []);

  const disconnect = useCallback(async () => {
    await disconnectMutation();
    window.location.reload();
  }, [disconnectMutation]);

  return {
    isConnected,
    isLoading,
    connect,
    disconnect,
  };
}

/**
 * Hook to fetch and manage YouTube playlists
 */
export function useYoutubePlaylists() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const connectionStatus = useQuery(
    youtubeApi?.getYoutubeConnectionStatus
  ) as ConnectionStatus | undefined;
  const playlists = useQuery(
    youtubeApi?.getYoutubePlaylists
  ) as YouTubePlaylist[] | undefined;
  const fetchPlaylists = useAction(youtubeApi?.fetchYoutubePlaylists);

  const isConnected = connectionStatus?.connected ?? false;
  const isLoading = connectionStatus === undefined || playlists === undefined;

  // Check if cache is stale
  const isStale =
    playlists &&
    playlists.length > 0 &&
    playlists.some((p: YouTubePlaylist) => p.isStale);

  // Auto-refresh if connected and cache is empty or stale
  useEffect(() => {
    if (isConnected && !isRefreshing && playlists !== undefined) {
      if (playlists.length === 0 || isStale) {
        refresh();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, playlists]);

  const refresh = useCallback(async () => {
    if (!isConnected || isRefreshing) return;
    setIsRefreshing(true);
    try {
      await fetchPlaylists();
    } catch (error) {
      console.error("Failed to fetch playlists:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [isConnected, isRefreshing, fetchPlaylists]);

  return {
    playlists: playlists ?? [],
    isLoading,
    isRefreshing,
    isConnected,
    refresh,
  };
}

/**
 * Hook to fetch videos for a specific YouTube playlist
 */
export function useYoutubePlaylistVideos(playlistId: string | null) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const connectionStatus = useQuery(
    youtubeApi?.getYoutubeConnectionStatus
  ) as ConnectionStatus | undefined;
  const videos = useQuery(
    youtubeApi?.getPlaylistVideos,
    playlistId ? { playlistId } : "skip"
  ) as YouTubeVideo[] | undefined;
  const fetchVideos = useAction(youtubeApi?.fetchPlaylistItems);

  const isConnected = connectionStatus?.connected ?? false;
  const isLoading = connectionStatus === undefined || videos === undefined;

  // Check if cache is stale
  const isStale =
    videos &&
    videos.length > 0 &&
    videos.some((v: YouTubeVideo) => v.isStale);

  // Auto-refresh if connected and cache is empty or stale
  useEffect(() => {
    if (playlistId && isConnected && !isRefreshing && videos !== undefined) {
      if (videos.length === 0 || isStale) {
        refresh();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlistId, isConnected, videos]);

  const refresh = useCallback(async () => {
    if (!playlistId || !isConnected || isRefreshing) return;
    setIsRefreshing(true);
    try {
      await fetchVideos({ playlistId });
    } catch (error) {
      console.error("Failed to fetch playlist videos:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [playlistId, isConnected, isRefreshing, fetchVideos]);

  return {
    videos: videos ?? [],
    isLoading,
    isRefreshing,
    isConnected,
    refresh,
  };
}

/**
 * Hook to get a single playlist by ID
 */
export function useYoutubePlaylist(playlistId: string | null) {
  const playlist = useQuery(
    youtubeApi?.getPlaylistById,
    playlistId ? { playlistId } : "skip"
  ) as YouTubePlaylist | undefined;

  return {
    playlist,
    isLoading: playlist === undefined,
  };
}

/**
 * Hook to get all videos from all playlists
 */
export function useAllYoutubeVideos() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const connectionStatus = useQuery(
    youtubeApi?.getYoutubeConnectionStatus
  ) as ConnectionStatus | undefined;
  const videos = useQuery(youtubeApi?.getAllVideos) as YouTubeVideo[] | undefined;
  const playlists = useQuery(
    youtubeApi?.getYoutubePlaylists
  ) as YouTubePlaylist[] | undefined;
  const fetchPlaylists = useAction(youtubeApi?.fetchYoutubePlaylists);
  const fetchPlaylistItems = useAction(youtubeApi?.fetchPlaylistItems);

  const isConnected = connectionStatus?.connected ?? false;
  const isLoading =
    connectionStatus === undefined ||
    videos === undefined ||
    playlists === undefined;

  // Refresh all playlists and their videos
  const refreshAll = useCallback(async () => {
    if (!isConnected || isRefreshing) return;
    setIsRefreshing(true);
    try {
      // First refresh playlists
      const freshPlaylists = await fetchPlaylists();
      // Then refresh videos for each playlist
      await Promise.all(
        (freshPlaylists as Array<{ youtubePlaylistId: string }>).map(
          (p: { youtubePlaylistId: string }) =>
            fetchPlaylistItems({ playlistId: p.youtubePlaylistId })
        )
      );
    } catch (error) {
      console.error("Failed to refresh all data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [isConnected, isRefreshing, fetchPlaylists, fetchPlaylistItems]);

  return {
    videos: videos ?? [],
    isLoading,
    isRefreshing,
    isConnected,
    refreshAll,
  };
}

/**
 * Hook for YouTube playlist management actions
 */
export function useYoutubePlaylistActions() {
  const [isLoading, setIsLoading] = useState(false);
  const createPlaylist = useAction(youtubeApi?.createYoutubePlaylist);
  const deletePlaylist = useAction(youtubeApi?.deleteYoutubePlaylist);
  const addToPlaylist = useAction(youtubeApi?.addVideoToYoutubePlaylist);
  const removeFromPlaylist = useAction(youtubeApi?.removeVideoFromYoutubePlaylist);

  const create = useCallback(
    async (title: string, description?: string, privacyStatus?: string) => {
      setIsLoading(true);
      try {
        return await createPlaylist({ title, description, privacyStatus });
      } finally {
        setIsLoading(false);
      }
    },
    [createPlaylist]
  );

  const remove = useCallback(
    async (playlistId: string) => {
      setIsLoading(true);
      try {
        await deletePlaylist({ playlistId });
      } finally {
        setIsLoading(false);
      }
    },
    [deletePlaylist]
  );

  const addVideo = useCallback(
    async (playlistId: string, videoId: string) => {
      setIsLoading(true);
      try {
        return await addToPlaylist({ playlistId, videoId });
      } finally {
        setIsLoading(false);
      }
    },
    [addToPlaylist]
  );

  const removeVideo = useCallback(
    async (playlistItemId: string, playlistId: string) => {
      setIsLoading(true);
      try {
        await removeFromPlaylist({ playlistItemId, playlistId });
      } finally {
        setIsLoading(false);
      }
    },
    [removeFromPlaylist]
  );

  return {
    isLoading,
    create,
    remove,
    addVideo,
    removeVideo,
  };
}
