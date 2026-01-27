"use client";

import Header from "@/components/Header";
import { ArrowLeft, Plus, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "@/i18n";

export default function CreatePlaylistPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement playlist creation logic
    console.log("Creating playlist:", { title, description, isPublic });
  };

  return (
    <main className="min-h-screen bg-background dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900/50 dark:to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 dark:bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-primary/5 dark:bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-primary/5 dark:bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />

        <div className="container py-8 max-w-2xl">
          <div className="mb-8">
            <Link
              href="/playlists"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.playlistCreate.backToPlaylists}
            </Link>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 shadow-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                {t.playlistCreate.title}
              </h1>
            </div>
            <p className="text-muted-foreground text-sm ml-14">
              {t.playlistCreate.subtitle}
            </p>
          </div>

          <div className="bg-card dark:bg-white/5 border border-border dark:border-white/10 rounded-xl backdrop-blur-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.playlistCreate.titleLabel}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary dark:bg-white/10 border border-border dark:border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t.playlistCreate.titlePlaceholder}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.playlistCreate.descriptionLabel}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary dark:bg-white/10 border border-border dark:border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder={t.playlistCreate.descriptionPlaceholder}
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-border dark:border-white/20 bg-secondary dark:bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
                <label
                  htmlFor="isPublic"
                  className="text-sm text-foreground"
                >
                  {t.playlistCreate.makePublic}
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Link href="/playlists" className="flex-1">
                  <button
                    type="button"
                    className="w-full px-6 py-3 bg-secondary dark:bg-white/10 text-foreground rounded-lg hover:bg-accent dark:hover:bg-white/20 transition-colors"
                  >
                    {t.common.cancel}
                  </button>
                </Link>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  {t.playlistCreate.create}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center text-muted-foreground text-sm">
            <p>{t.playlistCreate.helpText}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
