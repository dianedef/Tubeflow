"use client";

import Header from "@/components/Header";
import { ArrowLeft, Plus, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CreatePlaylistPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement playlist creation logic
    console.log("Creating playlist:", { title, description, isPublic });
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

        <div className="container py-8 max-w-2xl">
          <div className="mb-8">
            <Link
              href="/playlists"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux playlists
            </Link>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 shadow-lg">
                <Plus className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-primary-foreground">
                Nouvelle Playlist
              </h1>
            </div>
            <p className="text-muted-foreground text-sm ml-14">
              Créez une collection organisée de vos vidéos préférées
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-primary-foreground mb-2">
                  Titre de la playlist *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-primary-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Tutoriels React avancés"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-primary-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Décrivez le contenu de votre playlist..."
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
                <label
                  htmlFor="isPublic"
                  className="text-sm text-primary-foreground"
                >
                  Rendre cette playlist publique
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Link href="/playlists" className="flex-1">
                  <button
                    type="button"
                    className="w-full px-6 py-3 bg-white/10 text-primary-foreground rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Annuler
                  </button>
                </Link>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  Créer la playlist
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center text-muted-foreground text-sm">
            <p>
              Les playlists vous aident à organiser et partager vos collections
              de vidéos
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
