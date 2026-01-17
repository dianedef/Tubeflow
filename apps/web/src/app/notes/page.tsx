"use client";

import Header from "@/components/Header";
import Notes from "@/components/notes/Notes";
import { FileText, Sparkles } from "lucide-react";

export default function NotesPage() {
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
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-primary-foreground">
                Mes Notes
              </h1>
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
            <p className="text-muted-foreground text-sm ml-14">
              Capturez vos idées • Organisez vos pensées
            </p>
          </div>

          <Notes />

          <div className="mt-8 text-center text-muted-foreground text-sm">
            <p>Notes synchronisées • Accès partout • Recherche intelligente</p>
          </div>
        </div>
      </div>
    </main>
  );
}
