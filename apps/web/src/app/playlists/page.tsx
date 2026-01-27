"use client";

import Header from "@/components/Header";
import SwipeablePlaylistCard from "@/components/playlists/SwipeablePlaylistCard";
import { YouTubeConnectPrompt, YouTubeConnectionStatus } from "@/components/youtube";
import { useYoutubePlaylists, useYoutubePlaylistActions } from "@/hooks/use-youtube";
import { List, Sparkles, Plus, RefreshCw, Youtube } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "@/i18n";

export default function PlaylistsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState<string | null>(null);

  const { playlists, isLoading, isRefreshing, isConnected, refresh } =
    useYoutubePlaylists();
  const { remove: deletePlaylist, isLoading: isDeleting } =
    useYoutubePlaylistActions();

  useEffect(() => {
    if (searchParams.get("youtube_connected") === "true") {
      setShowSuccessToast(true);
      router.replace("/playlists", { scroll: false });
      setTimeout(() => setShowSuccessToast(false), 5000);
    }
    const error = searchParams.get("youtube_error");
    if (error) {
      setShowErrorToast(error);
      router.replace("/playlists", { scroll: false });
      setTimeout(() => setShowErrorToast(null), 5000);
    }
  }, [searchParams, router]);

  const handlePlayAll = (id: string) => {
    router.push(`/playlists/${id}?autoplay=true`);
  };

  const handleEdit = (id: string) => {
    console.log("Edit playlist", id);
  };

  const handleShare = (id: string) => {
    const url = `https://www.youtube.com/playlist?list=${id}`;
    navigator.clipboard.writeText(url);
    alert(t.playlistsPage.linkCopied);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t.playlistsPage.confirmDelete)) {
      try {
        await deletePlaylist(id);
      } catch (error) {
        console.error("Failed to delete playlist:", error);
        alert(t.playlistsPage.deleteError);
      }
    }
  };

  const handleClick = (id: string) => {
    router.push(`/playlists/${id}`);
  };

  interface PlaylistItem {
    id: string;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    videoCount: number;
    publishedAt?: string;
    privacyStatus: string;
  }

  const transformedPlaylists = playlists.map((playlist: PlaylistItem) => ({
    id: playlist.id,
    title: playlist.title,
    description: playlist.description || "",
    thumbnailUrl: playlist.thumbnailUrl || "https://via.placeholder.com/300x200",
    videoCount: playlist.videoCount,
    createdAt: playlist.publishedAt || new Date().toISOString(),
    isPublic: playlist.privacyStatus === "public",
  }));

  return (
    <main className="min-h-screen bg-background dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900/50 dark:to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 dark:bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-primary/5 dark:bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-primary/5 dark:bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />

        <div className="container py-8">
          {showSuccessToast && (
            <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-green-500/20 border border-green-500/30 backdrop-blur-sm flex items-center gap-3 animate-in slide-in-from-right">
              <Youtube className="w-5 h-5 text-green-500" />
              <span className="text-sm text-foreground">
                {t.playlistsPage.connectedSuccess}
              </span>
            </div>
          )}

          {showErrorToast && (
            <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-red-500/20 border border-red-500/30 backdrop-blur-sm flex items-center gap-3 animate-in slide-in-from-right">
              <Youtube className="w-5 h-5 text-red-500" />
              <span className="text-sm text-foreground">{showErrorToast}</span>
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 shadow-lg">
                  <List className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                  {t.playlistsPage.title}
                </h1>
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-3">
                {isConnected && (
                  <>
                    <button
                      onClick={refresh}
                      disabled={isRefreshing}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      title={t.playlistsPage.refreshPlaylists}
                    >
                      <RefreshCw
                        className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                      />
                    </button>
                    <Link href="/playlists/create">
                      <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg">
                        <Plus className="w-4 h-4" />
                        {t.playlistsPage.newPlaylist}
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm ml-14">
                {isConnected
                  ? `${t.playlistsPage.swipeToManage} \u2022 ${transformedPlaylists.length} ${t.playlistsPage.youtubePlaylistsCount}`
                  : t.playlistsPage.connectToSee}
              </p>
              {isConnected && (
                <YouTubeConnectionStatus showDisconnect compact />
              )}
            </div>
          </div>

          {!isLoading && !isConnected && (
            <div className="py-8">
              <YouTubeConnectPrompt />
            </div>
          )}

          {isLoading && isConnected && (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin" />
            </div>
          )}

          {isConnected && !isLoading && (
            <>
              <div className="mb-6 p-4 rounded-xl bg-secondary/50 dark:bg-white/5 border border-border dark:border-white/10 backdrop-blur-sm sm:hidden">
                <p className="text-sm text-foreground text-center">
                  {t.playlistsPage.swipeHint}
                </p>
              </div>

              <div className="space-y-4">
                {transformedPlaylists.map((playlist) => (
                  <SwipeablePlaylistCard
                    key={playlist.id}
                    playlist={playlist}
                    onPlayAll={handlePlayAll}
                    onEdit={handleEdit}
                    onShare={handleShare}
                    onDelete={handleDelete}
                    onClick={handleClick}
                  />
                ))}
              </div>

              {transformedPlaylists.length === 0 && !isRefreshing && (
                <div className="text-center py-12">
                  <List className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t.playlistsPage.noPlaylists}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t.playlistsPage.noPlaylistsDesc}
                  </p>
                  <Link href="/playlists/create">
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg">
                      {t.playlistsPage.createPlaylist}
                    </button>
                  </Link>
                </div>
              )}

              {transformedPlaylists.length > 0 && (
                <div className="mt-8 text-center text-muted-foreground text-sm">
                  <p>{t.playlistsPage.swipeActions}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
