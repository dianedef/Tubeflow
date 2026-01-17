"use client";

import Header from "@/components/Header";
import SwipeableVideoCard from "@/components/SwipeableVideoCard";
import { Video, Sparkles } from "lucide-react";

interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  views: string;
}

const sampleVideos: VideoData[] = [
  {
    id: "1",
    title: "Comment créer une startup tech en 2025 ?",
    description:
      "Les étapes clés pour lancer votre propre startup tech. De l'idée au financement, découvrez les meilleures pratiques.",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    channelTitle: "Alberta Tech",
    publishedAt: "2024-12-15",
    duration: "12:34",
    views: "45K",
  },
  {
    id: "2",
    title: "Les frameworks React à connaître en 2025",
    description:
      "Tour d'horizon des frameworks React les plus populaires et quand les utiliser dans vos projets.",
    thumbnailUrl: "https://img.youtube.com/vi/LXb3EKWsInQ/maxresdefault.jpg",
    channelTitle: "Alberta Tech",
    publishedAt: "2024-12-10",
    duration: "18:22",
    views: "32K",
  },
  {
    id: "3",
    title: "Guide complet: TypeScript vs JavaScript",
    description:
      "Pourquoi TypeScript gagne en popularité et comment migrer vos projets JavaScript.",
    thumbnailUrl: "https://img.youtube.com/vi/ahCwqrYpIuM/maxresdefault.jpg",
    channelTitle: "Alberta Tech",
    publishedAt: "2024-12-05",
    duration: "15:45",
    views: "28K",
  },
  {
    id: "4",
    title: "Architecture microservices avec Node.js",
    description:
      "Comment structurer une application microservices scalable avec Node.js et Docker.",
    thumbnailUrl: "https://img.youtube.com/vi/k8a5JH-1y8Y/maxresdefault.jpg",
    channelTitle: "Alberta Tech",
    publishedAt: "2024-11-28",
    duration: "22:10",
    views: "21K",
  },
  {
    id: "5",
    title: "Les bases de l'IA générative pour développeurs",
    description:
      "Comprendre comment utiliser les API d'OpenAI et Claude dans vos applications.",
    thumbnailUrl: "https://img.youtube.com/vi/2kT3Z7m3V1c/maxresdefault.jpg",
    channelTitle: "Alberta Tech",
    publishedAt: "2024-11-20",
    duration: "16:33",
    views: "35K",
  },
  {
    id: "6",
    title: "Déploiement CI/CD avec GitHub Actions",
    description:
      "Automatisez vos déploiements avec GitHub Actions. Tutoriel complet pour débutants et avancés.",
    thumbnailUrl: "https://img.youtube.com/vi/nJ7eG9K9D5E/maxresdefault.jpg",
    channelTitle: "Alberta Tech",
    publishedAt: "2024-11-12",
    duration: "19:58",
    views: "18K",
  },
];

export default function VideosPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10">
        <Header />

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">
                Mes Vidéos
              </h1>
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
            <p className="text-gray-400 text-sm ml-14">
              Swipe pour gérer • {sampleVideos.length} vidéos
            </p>
          </div>

          {/* Swipe hint for mobile */}
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm sm:hidden">
            <p className="text-sm text-gray-300 text-center">
              👈 Swipe gauche/droite pour les actions 👉
            </p>
          </div>

          {/* Video List */}
          <div className="space-y-4">
            {sampleVideos.map((video) => (
              <SwipeableVideoCard key={video.id} video={video} />
            ))}
          </div>

          {/* Footer hint */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Swipe left to share/delete • Swipe right to archive/like</p>
          </div>
        </div>
      </div>
    </main>
  );
}
