"use client";

import Header from "@/components/Header";
import SwipeableVideoCard from "@/components/SwipeableVideoCard";
import { YouTubeConnectPrompt, YouTubeConnectionStatus } from "@/components/youtube";
import { useAllYoutubeVideos, useYoutubeConnection } from "@/hooks/use-youtube";
import { Video, Sparkles, RefreshCw, Youtube } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n";

export default function VideosPage() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const { isConnected } = useYoutubeConnection();
  const { videos, isLoading, isRefreshing, refreshAll } = useAllYoutubeVideos();

  const handleVideoClick = (videoId: string) => {
    router.push(`/videos/watch/${videoId}`);
  };

  const handleVideoShare = (videoId: string) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    navigator.clipboard.writeText(url);
    alert(t.videosPage.linkCopied);
  };

  const handleVideoLike = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  };

  interface VideoItem {
    id: string;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    channelTitle: string;
    publishedAt?: string;
    duration?: string;
  }

  const transformedVideos = videos.map((video: VideoItem) => ({
    id: video.id,
    title: video.title,
    description: video.description || "",
    thumbnailUrl: video.thumbnailUrl || "https://via.placeholder.com/300x200",
    channelTitle: video.channelTitle,
    publishedAt: video.publishedAt || new Date().toISOString(),
    duration: video.duration || "0:00",
    views: "",
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
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                  {t.videosPage.title}
                </h1>
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-3">
                {isConnected && (
                  <button
                    onClick={refreshAll}
                    disabled={isRefreshing}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    title={t.videosPage.refreshAll}
                  >
                    <RefreshCw
                      className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                    />
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm ml-14">
                {isConnected
                  ? `${t.videosPage.swipeToManage} \u2022 ${transformedVideos.length} ${t.videosPage.videosFromPlaylists}`
                  : t.videosPage.connectToSee}
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
                  {t.videosPage.swipeHint}
                </p>
              </div>

              <div className="space-y-4">
                {transformedVideos.map((video) => (
                  <SwipeableVideoCard
                    key={video.id}
                    video={video}
                    onClick={handleVideoClick}
                    onShare={handleVideoShare}
                    onLike={handleVideoLike}
                  />
                ))}
              </div>

              {transformedVideos.length === 0 && !isRefreshing && (
                <div className="text-center py-12">
                  <Youtube className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t.videosPage.noVideos}
                  </h3>
                  <p className="text-muted-foreground mb-4 whitespace-pre-line">
                    {t.videosPage.noVideosDesc}
                  </p>
                </div>
              )}

              {transformedVideos.length > 0 && (
                <div className="mt-8 text-center text-muted-foreground text-sm">
                  <p>{t.videosPage.swipeActions}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
