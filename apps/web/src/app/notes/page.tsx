"use client";

import Header from "@/components/Header";
import Notes from "@/components/notes/Notes";
import { FileText, Sparkles } from "lucide-react";
import { useTranslation } from "@/i18n";

export default function NotesPage() {
  const { t } = useTranslation();

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
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                {t.notesPage.title}
              </h1>
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
            <p className="text-muted-foreground text-sm ml-14">
              {t.notesPage.subtitle}
            </p>
          </div>

          <Notes />

          <div className="mt-8 text-center text-muted-foreground text-sm">
            <p>{t.notesPage.footer}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
