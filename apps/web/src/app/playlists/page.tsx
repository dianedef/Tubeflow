"use client";

import Header from "@/components/Header";
import SwipeablePlaylistCard from "@/components/playlists/SwipeablePlaylistCard";
import { YouTubeConnectPrompt, YouTubeConnectionStatus } from "@/components/youtube";
import { useYoutubePlaylists, useYoutubePlaylistActions } from "@/hooks/use-youtube";
import { List, Sparkles, Plus, RefreshCw, Youtube } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PlaylistsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState<string | null>(null);

  const { playlists, isLoading, isRefreshing, isConnected, refresh } =
    useYoutubePlaylists();
  const { remove: deletePlaylist, isLoading: isDeleting } =
    useYoutubePlaylistActions();

  // Handle OAuth callback messages
  useEffect(() => {
    if (searchParams.get("youtube_connected") === "true") {
      setShowSuccessToast(true);
      // Clear the URL param
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
    // Get first video of playlist and navigate to it
    router.push(`/playlists/${id}?autoplay=true`);
  };

  const handleEdit = (id: string) => {
    // Navigate to edit page (to be implemented)
    console.log("Edit playlist", id);
  };

  const handleShare = (id: string) => {
    const url = `https://www.youtube.com/playlist?list=${id}`;
    navigator.clipboard.writeText(url);
    alert("Lien de la playlist copié !");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette playlist de YouTube ?")) {
      try {
        await deletePlaylist(id);
      } catch (error) {
        console.error("Failed to delete playlist:", error);
        alert("Erreur lors de la suppression de la playlist");
      }
    }
  };

  const handleClick = (id: string) => {
    router.push(`/playlists/${id}`);
  };

  // Transform YouTube playlists to the format expected by SwipeablePlaylistCard
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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10">
        <Header />

        <div className="container py-8">
          {/* Success Toast */}
          {showSuccessToast && (
            <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-green-500/20 border border-green-500/30 backdrop-blur-sm flex items-center gap-3 animate-in slide-in-from-right">
              <Youtube className="w-5 h-5 text-green-500" />
              <span className="text-sm text-foreground">
                YouTube connecté avec succès !
              </span>
            </div>
          )}

          {/* Error Toast */}
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
                  <List className="w-6 h-6 text-primary-foreground" />
                </div>
                <h1 className="text-3xl font-bold text-primary-foreground">
                  Mes Playlists
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
                      title="Rafraîchir les playlists"
                    >
                      <RefreshCw
                        className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                      />
                    </button>
                    <Link href="/playlists/create">
                      <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg">
                        <Plus className="w-4 h-4" />
                        Nouvelle Playlist
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm ml-14">
                {isConnected
                  ? `Swipe pour gérer • ${transformedPlaylists.length} playlists YouTube`
                  : "Connectez YouTube pour voir vos playlists"}
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

          {/* Connected but loading playlists */}
          {isConnected && !isLoading && (
            <>
              <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm sm:hidden">
                <p className="text-sm text-foreground text-center">
                  👈 Swipe gauche/droite pour les actions 👉
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
                  <h3 className="text-xl font-semibold text-primary-foreground mb-2">
                    Aucune playlist
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Vous n'avez pas encore de playlist sur YouTube
                  </p>
                  <Link href="/playlists/create">
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg">
                      Créer une playlist
                    </button>
                  </Link>
                </div>
              )}

              {transformedPlaylists.length > 0 && (
                <div className="mt-8 text-center text-muted-foreground text-sm">
                  <p>
                    Swipe gauche pour partager/supprimer • Swipe droite pour
                    lire/modifier
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
