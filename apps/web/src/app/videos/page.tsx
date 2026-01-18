"use client";

import Header from "@/components/Header";
import SwipeableVideoCard from "@/components/SwipeableVideoCard";
import { YouTubeConnectPrompt, YouTubeConnectionStatus } from "@/components/youtube";
import { useAllYoutubeVideos, useYoutubeConnection } from "@/hooks/use-youtube";
import { Video, Sparkles, RefreshCw, Youtube } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VideosPage() {
  const router = useRouter();
  const { isConnected } = useYoutubeConnection();
  const { videos, isLoading, isRefreshing, refreshAll } = useAllYoutubeVideos();

  const handleVideoClick = (videoId: string) => {
    router.push(`/videos/watch/${videoId}`);
  };

  const handleVideoShare = (videoId: string) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    navigator.clipboard.writeText(url);
    alert("Lien de la vidéo copié !");
  };

  const handleVideoLike = (videoId: string) => {
    // Open YouTube to like the video (can't do it via API without YouTube Data API write scope)
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  };

  // Transform videos to the format expected by SwipeableVideoCard
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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10">
        <Header />

        <div className="container py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <Video className="w-6 h-6 text-primary-foreground" />
                </div>
                <h1 className="text-3xl font-bold text-primary-foreground">
                  Mes Vidéos
                </h1>
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-3">
                {isConnected && (
                  <button
                    onClick={refreshAll}
                    disabled={isRefreshing}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    title="Rafraîchir toutes les vidéos"
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
                  ? `Swipe pour gérer • ${transformedVideos.length} vidéos de vos playlists`
                  : "Connectez YouTube pour voir vos vidéos"}
              </p>
              {isConnected && (
                <YouTubeConnectionStatus showDisconnect compact />
              )}
            </div>
          </div>

          {/* Not connected - Show connect prompt */}
          {!isLoading && !isConnected && (
            <div className="py-8">
              <YouTubeConnectPrompt />
            </div>
          )}

          {/* Loading state */}
          {isLoading && isConnected && (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin" />
            </div>
          )}

          {/* Connected with videos */}
          {isConnected && !isLoading && (
            <>
              <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm sm:hidden">
                <p className="text-sm text-foreground text-center">
                  👈 Swipe gauche/droite pour les actions 👉
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
                  <h3 className="text-xl font-semibold text-primary-foreground mb-2">
                    Aucune vidéo
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Vos playlists YouTube ne contiennent pas encore de vidéos.
                    <br />
                    Ajoutez des vidéos à vos playlists pour les voir ici.
                  </p>
                </div>
              )}

              {transformedVideos.length > 0 && (
                <div className="mt-8 text-center text-muted-foreground text-sm">
                  <p>Swipe left to share/delete • Swipe right to archive/like</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
