"use client";

import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  views: string;
}

const sampleVideos: Video[] = [
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
    <main className="bg-[#EDEDED] min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Vidéos</h1>
        <div className="space-y-4">
          {sampleVideos.map((video) => (
            <Card
              key={video.id}
              className="group cursor-pointer transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-primary"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  console.log("Video clicked:", video.id);
                }
              }}
            >
              <CardContent className="p-0">
                <div className="flex gap-4 p-4">
                  <div className="relative shrink-0 w-64 aspect-video rounded-md overflow-hidden bg-muted">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge
                      variant="default"
                      className="absolute bottom-2 right-2 bg-black/80 hover:bg-black/90 border-none"
                    >
                      {video.duration}
                    </Badge>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {video.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">
                      <span>{video.views} vues</span>
                      <span>•</span>
                      <span>
                        {new Date(video.publishedAt).toLocaleDateString(
                          "fr-FR",
                        )}
                      </span>
                      <span>•</span>
                      <span>{video.duration}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {video.channelTitle}
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4 pt-0">
                  <h2 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h2>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
