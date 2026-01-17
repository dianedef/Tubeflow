"use client";

import Header from "@/components/Header";
import SwipeablePlaylistCard from "@/components/playlists/SwipeablePlaylistCard";
import { List, Sparkles, Plus } from "lucide-react";
import Link from "next/link";

interface PlaylistData {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoCount: number;
  createdAt: string;
  isPublic: boolean;
}

const samplePlaylists: PlaylistData[] = [
  {
    id: "1",
    title: "React & Next.js Tutorials",
    description:
      "Collection complète de tutoriels React et Next.js pour maîtriser ces technologies.",
    thumbnailUrl: "https://img.youtube.com/vi/LXb3EKWsInQ/maxresdefault.jpg",
    videoCount: 12,
    createdAt: "2024-12-10",
    isPublic: true,
  },
  {
    id: "2",
    title: "Backend avec Node.js",
    description:
      "Guides et bonnes pratiques pour développer des APIs robustes avec Node.js.",
    thumbnailUrl: "https://img.youtube.com/vi/k8a5JH-1y8Y/maxresdefault.jpg",
    videoCount: 8,
    createdAt: "2024-11-28",
    isPublic: false,
  },
  {
    id: "3",
    title: "DevOps & CI/CD",
    description:
      "Automatisation des déploiements, conteneurisation et bonnes pratiques DevOps.",
    thumbnailUrl: "https://img.youtube.com/vi/nJ7eG9K9D5E/maxresdefault.jpg",
    videoCount: 6,
    createdAt: "2024-11-12",
    isPublic: true,
  },
  {
    id: "4",
    title: "IA & Machine Learning",
    description:
      "Introduction aux concepts d'IA et comment intégrer des modèles dans vos apps.",
    thumbnailUrl: "https://img.youtube.com/vi/2kT3Z7m3V1c/maxresdefault.jpg",
    videoCount: 10,
    createdAt: "2024-11-20",
    isPublic: true,
  },
];

export default function PlaylistsPage() {
  const handlePlayAll = (id: string) => {
    console.log("Play all videos in playlist", id);
    // TODO: Navigate to first video of playlist with autoplay
  };

  const handleEdit = (id: string) => {
    console.log("Edit playlist", id);
    // TODO: Navigate to edit page or open modal
  };

  const handleShare = (id: string) => {
    console.log("Share playlist", id);
    // TODO: Open share modal
  };

  const handleDelete = (id: string) => {
    console.log("Delete playlist", id);
    // TODO: Confirm and delete
    alert("Playlist exemple - suppression simulée");
  };

  const handleClick = (id: string) => {
    console.log("Navigate to playlist", id);
    // TODO: Navigate to playlist detail page
  };

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
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 shadow-lg">
                  <List className="w-6 h-6 text-primary-foreground" />
                </div>
                <h1 className="text-3xl font-bold text-primary-foreground">
                  Mes Playlists
                </h1>
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              </div>
              <Link href="/playlists/create">
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg">
                  <Plus className="w-4 h-4" />
                  Nouvelle Playlist
                </button>
              </Link>
            </div>
            <p className="text-muted-foreground text-sm ml-14">
              Swipe pour gérer • {samplePlaylists.length} playlists
            </p>
          </div>

          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm sm:hidden">
            <p className="text-sm text-foreground text-center">
              👈 Swipe gauche/droite pour les actions 👉
            </p>
          </div>

          <div className="space-y-4">
            {samplePlaylists.map((playlist) => (
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

          {samplePlaylists.length === 0 && (
            <div className="text-center py-12">
              <List className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary-foreground mb-2">
                Aucune playlist
              </h3>
              <p className="text-muted-foreground mb-4">
                Créez votre première playlist pour organiser vos vidéos
              </p>
              <Link href="/playlists/create">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg">
                  Créer une playlist
                </button>
              </Link>
            </div>
          )}

          <div className="mt-8 text-center text-muted-foreground text-sm">
            <p>Swipe gauche pour partager/supprimer • Swipe droite pour lire/modifier</p>
          </div>
        </div>
      </div>
    </main>
  );
}
