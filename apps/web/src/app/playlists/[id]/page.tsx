"use client";

import Header from "@/components/Header";
import SwipeableVideoCard from "@/components/SwipeableVideoCard";
import {
  useYoutubePlaylist,
  useYoutubePlaylistVideos,
  useYoutubePlaylistActions,
} from "@/hooks/use-youtube";
import {
  ArrowLeft,
  Play,
  Share2,
  RefreshCw,
  Globe,
  Lock,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

interface VideoItem {
  id: string;
  playlistItemId?: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  channelTitle: string;
  duration?: string;
  publishedAt?: string;
}

export default function PlaylistDetailPage() {
  const router = useRouter();
  const params = useParams();
  const playlistId = params.id as string;

  const { playlist, isLoading: isLoadingPlaylist } =
    useYoutubePlaylist(playlistId);
  const { videos, isLoading, isRefreshing, refresh } =
    useYoutubePlaylistVideos(playlistId);
  const { removeVideo, isLoading: isRemoving } = useYoutubePlaylistActions();

  const handlePlayAll = () => {
    if (videos.length > 0) {
      router.push(`/videos/watch/${videos[0].id}?playlist=${playlistId}`);
    }
  };

  const handleShare = () => {
    const url = `https://www.youtube.com/playlist?list=${playlistId}`;
    navigator.clipboard.writeText(url);
    alert("Lien de la playlist copié !");
  };

  const handleVideoClick = (videoId: string) => {
    router.push(`/videos/watch/${videoId}?playlist=${playlistId}`);
  };

  const handleVideoDelete = async (videoId: string) => {
    const video = videos.find((v: VideoItem) => v.id === videoId);
    if (!video?.playlistItemId) return;

    if (
      confirm("Voulez-vous retirer cette vidéo de la playlist ?")
    ) {
      try {
        await removeVideo(video.playlistItemId, playlistId);
      } catch (error) {
        console.error("Failed to remove video:", error);
        alert("Erreur lors du retrait de la vidéo");
      }
    }
  };

  // Transform videos to the format expected by SwipeableVideoCard
  const transformedVideos = videos.map((video: VideoItem) => ({
    id: video.id,
    title: video.title,
    description: video.description || "",
    thumbnailUrl:
      video.thumbnailUrl || "https://via.placeholder.com/300x200",
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
          {/* Back button */}
          <Link
            href="/playlists"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux playlists
          </Link>

          {/* Playlist Header */}
          {isLoadingPlaylist ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin" />
            </div>
          ) : playlist ? (
            <div className="mb-8 p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Thumbnail */}
                <div className="relative w-full md:w-64 aspect-video rounded-xl overflow-hidden">
                  <img
                    src={
                      playlist.thumbnailUrl ||
                      "https://via.placeholder.com/300x200"
                    }
                    alt={playlist.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <Youtube className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-white font-medium">
                      {playlist.videoCount} vidéos
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground mb-2">
                        {playlist.title}
                      </h1>
                      {playlist.description && (
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                          {playlist.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {playlist.privacyStatus === "public" ? (
                            <>
                              <Globe className="w-4 h-4" />
                              Public
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" />
                              {playlist.privacyStatus === "private"
                                ? "Privé"
                                : "Non répertorié"}
                            </>
                          )}
                        </span>
                        {playlist.publishedAt && (
                          <span>
                            Créée le{" "}
                            {new Date(playlist.publishedAt).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 mt-6">
                    <button
                      onClick={handlePlayAll}
                      disabled={videos.length === 0}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg disabled:opacity-50"
                    >
                      <Play className="w-4 h-4" fill="currentColor" />
                      Tout lire
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-foreground rounded-lg transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      Partager
                    </button>
                    <button
                      onClick={refresh}
                      disabled={isRefreshing}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-foreground rounded-lg transition-colors disabled:opacity-50"
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                      />
                      Rafraîchir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Playlist non trouvée</p>
            </div>
          )}

          {/* Videos List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <>
              <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm sm:hidden">
                <p className="text-sm text-foreground text-center">
                  👈 Swipe gauche/droite pour les actions 👉
                </p>
              </div>

              <div className="space-y-4">
                {transformedVideos.map((video, index) => (
                  <div key={video.id} className="relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 text-muted-foreground text-sm font-medium">
                      {index + 1}
                    </div>
                    <SwipeableVideoCard
                      video={video}
                      onClick={handleVideoClick}
                      onDelete={handleVideoDelete}
                    />
                  </div>
                ))}
              </div>

              {transformedVideos.length === 0 && (
                <div className="text-center py-12">
                  <Youtube className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-primary-foreground mb-2">
                    Aucune vidéo
                  </h3>
                  <p className="text-muted-foreground">
                    Cette playlist est vide
                  </p>
                </div>
              )}

              {transformedVideos.length > 0 && (
                <div className="mt-8 text-center text-muted-foreground text-sm">
                  <p>
                    Cliquez sur une vidéo pour la regarder et prendre des notes
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
