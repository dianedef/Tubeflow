"use client";

import { api } from "@packages/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useState } from "react";
import NoteItem from "./NoteItem";

// Sample notes data for demonstration
const sampleNotes = [
  {
    _id: "note-1",
    title: "Introduction aux Hooks React - useState et useEffect",
    description:
      "Notes prises pendant la vidéo : Les hooks React permettent de gérer l'état et les effets dans les composants fonctionnels. useState retourne un tableau avec la valeur actuelle et une fonction pour la modifier. useEffect permet d'effectuer des opérations après le rendu du composant. Très utile pour synchroniser avec des APIs externes.",
    thumbnailUrl: "https://img.youtube.com/vi/LXb3EKWsInQ/maxresdefault.jpg",
    views: 2450,
    _creationTime: Date.now() - 86400000 * 2, // 2 days ago
  },
  {
    _id: "note-2",
    title: "Architecture Microservices avec Node.js",
    description:
      "Points clés : Séparation des responsabilités, communication via API REST ou GraphQL, gestion des erreurs distribuées, monitoring et logging centralisés. Avantages : scalabilité, maintenance facilitée, déploiement indépendant. Inconvénients : complexité accrue, latence réseau.",
    thumbnailUrl: "https://img.youtube.com/vi/k8a5JH-1y8Y/maxresdefault.jpg",
    views: 1820,
    _creationTime: Date.now() - 86400000 * 5, // 5 days ago
  },
  {
    _id: "note-3",
    title: "Guide complet TypeScript pour débutants",
    description:
      "TypeScript ajoute la sécurité des types à JavaScript. Types de base : string, number, boolean, array, object. Interfaces pour définir la structure des objets. Generics pour les fonctions réutilisables. Configuration tsconfig.json essentielle. Compilation vers JavaScript pour exécution.",
    thumbnailUrl: "https://img.youtube.com/vi/ahCwqrYpIuM/maxresdefault.jpg",
    views: 3200,
    _creationTime: Date.now() - 86400000 * 7, // 1 week ago
  },
  {
    _id: "note-4",
    title: "Déploiement CI/CD avec GitHub Actions",
    description:
      "Workflows automatisés : déclencheurs (push, pull request), jobs (build, test, deploy), actions réutilisables. Secrets pour les credentials. Environnements pour staging/production. Cache pour accélérer les builds. Intégration avec Docker, Kubernetes.",
    thumbnailUrl: "https://img.youtube.com/vi/nJ7eG9K9D5E/maxresdefault.jpg",
    views: 1560,
    _creationTime: Date.now() - 86400000 * 10, // 10 days ago
  },
  {
    _id: "note-5",
    title: "Les bases de l'Intelligence Artificielle générative",
    description:
      "LLMs (Large Language Models) comme GPT, Claude. Prompt engineering pour de meilleurs résultats. Fine-tuning pour adapter aux besoins spécifiques. Éthique de l'IA : biais, transparence, responsabilité. Applications : génération de texte, analyse de code, assistants virtuels.",
    thumbnailUrl: "https://img.youtube.com/vi/2kT3Z7m3V1c/maxresdefault.jpg",
    views: 2890,
    _creationTime: Date.now() - 86400000 * 12, // 12 days ago
  },
  {
    _id: "note-6",
    title: "Optimisation des performances web",
    description:
      "Techniques essentielles : lazy loading, code splitting, compression, caching. Outils : Lighthouse, Web Vitals. Métriques importantes : FCP, LCP, CLS, FID. CDN pour la distribution globale. Images optimisées, fonts chargées efficacement.",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: 2100,
    _creationTime: Date.now() - 86400000 * 15, // 15 days ago
  },
  {
    _id: "note-7",
    title: "Next.js 14 : Nouvelles fonctionnalités App Router",
    description:
      "App Router révolutionne la structure des applications Next.js. Server Components pour le rendu côté serveur. Layouts imbriqués. Loading states automatiques. API routes simplifiées. Migration progressive depuis pages router.",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: 3100,
    _creationTime: Date.now() - 86400000 * 18, // 18 days ago
  },
  {
    _id: "note-8",
    title: "Sécurité web : OWASP Top 10",
    description:
      "Les 10 vulnérabilités web les plus critiques : Injection, Broken Authentication, Sensitive Data Exposure, XML External Entities, Broken Access Control, Security Misconfiguration, XSS, Insecure Deserialization, Vulnerable Components, Insufficient Logging.",
    thumbnailUrl: "https://img.youtube.com/vi/LXb3EKWsInQ/maxresdefault.jpg",
    views: 1950,
    _creationTime: Date.now() - 86400000 * 20, // 20 days ago
  },
];

const Notes = () => {
  const [search, setSearch] = useState("");

  const allVideos = useQuery(api.videos.getVideos);
  const deleteVideo = useMutation(api.videos.deleteVideo);

  // Use sample data if no videos from Convex or if empty
  const videosData =
    allVideos && allVideos.length > 0 ? allVideos : sampleNotes;

  const finalVideos = search
    ? videosData?.filter(
        (video: { title: string; description: string }) =>
          video.title.toLowerCase().includes(search.toLowerCase()) ||
          video.description.toLowerCase().includes(search.toLowerCase()),
      )
    : videosData;

  return (
    <div className="container pb-10">
      <h1 className="text-center text-[20px] sm:text-[43px] not-italic font-normal sm:font-medium leading-[114.3%] tracking-[-1.075px] sm:mt-8 my-4 sm:mb-10">
        Your Notes
      </h1>
      <div className="px-5 sm:px-0">
        <div className="bg-card flex items-center h-[39px] sm:h-[55px] rounded-sm border border-solid gap-2 sm:gap-5 mb-10 border-gray-400/40 px-3 sm:px-11">
          <Image
            src="/images/search.svg"
            width={23}
            height={22}
            alt="search"
            className="cursor-pointer sm:w-[23px] sm:h-[22px] w-[20px] h-[20px]"
          />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-[17px] sm:text-2xl not-italic font-light leading-[114.3%] tracking-[-0.6px] focus:outline-0 focus:ring-0 focus:border-0 border-0"
          />
        </div>
      </div>

      <div className="border-[0.5px] mb-20 divide-y-[0.5px] divide-border border-border">
        {finalVideos &&
          finalVideos.map(
            (
              video: {
                _id: string;
                title: string;
                description: string;
                thumbnailUrl?: string;
                views: number;
                _creationTime: number;
              },
              index: number,
            ) => <NoteItem key={index} note={video} />,
          )}
      </div>
    </div>
  );
};

export default Notes;
