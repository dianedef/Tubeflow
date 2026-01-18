"use client";

import { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import type { OnProgressProps } from "react-player/base";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import YouTubeNotesPanel from "@/components/videos/YouTubeNotesPanel";
import {
  ArrowLeft,
  Share2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";

interface VideoInfo {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  channelTitle: string;
  publishedAt?: string;
}

export default function VideoWatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const videoId = params.videoId as string;
  const playlistId = searchParams.get("playlist");
  const startTime = searchParams.get("t");

  const playerRef = useRef<ReactPlayer>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [showNotes, setShowNotes] = useState(true);

  // Get playlist videos if we have a playlist ID
  const playlistVideos = useQuery(
    // @ts-expect-error - youtube module is generated after convex dev runs
    api.youtube?.getPlaylistVideos,
    playlistId ? { playlistId } : "skip"
  ) as VideoInfo[] | undefined;

  // Get video info from cache
  // @ts-expect-error - youtube module is generated after convex dev runs
  const allVideos = useQuery(api.youtube?.getAllVideos) as VideoInfo[] | undefined;
  const videoInfo = allVideos?.find((v: VideoInfo) => v.id === videoId);

  // Find current video index in playlist
  const currentIndex = playlistVideos?.findIndex((v) => v.id === videoId) ?? -1;
  const prevVideo = currentIndex > 0 ? playlistVideos?.[currentIndex - 1] : null;
  const nextVideo =
    playlistVideos && currentIndex < playlistVideos.length - 1
      ? playlistVideos[currentIndex + 1]
      : null;

  // Seek to start time when ready
  useEffect(() => {
    if (isReady && startTime && playerRef.current) {
      const seconds = parseInt(startTime, 10);
      if (!isNaN(seconds)) {
        playerRef.current.seekTo(seconds, "seconds");
      }
    }
  }, [isReady, startTime]);

  const handleProgress = (state: OnProgressProps) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleSeek = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, "seconds");
    }
  };

  const handleShare = () => {
    const url = `https://www.youtube.com/watch?v=${videoId}${currentTime > 0 ? `&t=${Math.floor(currentTime)}` : ""}`;
    navigator.clipboard.writeText(url);
    alert("Lien copié avec le timestamp !");
  };

  const handleOpenInYouTube = () => {
    window.open(
      `https://www.youtube.com/watch?v=${videoId}${currentTime > 0 ? `&t=${Math.floor(currentTime)}` : ""}`,
      "_blank"
    );
  };

  const navigateToVideo = (targetVideoId: string) => {
    const url = playlistId
      ? `/videos/watch/${targetVideoId}?playlist=${playlistId}`
      : `/videos/watch/${targetVideoId}`;
    router.push(url);
  };

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10">
        <Header />

        <div className="container py-6">
          {/* Back button */}
          <div className="flex items-center justify-between mb-4">
            <Link
              href={playlistId ? `/playlists/${playlistId}` : "/videos"}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {playlistId ? "Retour à la playlist" : "Retour aux vidéos"}
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                title="Partager"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleOpenInYouTube}
                className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                title="Ouvrir sur YouTube"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowNotes(!showNotes)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  showNotes
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-white/5 text-muted-foreground hover:text-foreground"
                }`}
              >
                {showNotes ? "Masquer notes" : "Afficher notes"}
              </button>
            </div>
          </div>

          <div
            className={`grid gap-6 ${showNotes ? "lg:grid-cols-[1fr_400px]" : "grid-cols-1"}`}
          >
            {/* Video Player */}
            <div>
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                <ReactPlayer
                  ref={playerRef}
                  url={youtubeUrl}
                  width="100%"
                  height="100%"
                  playing={true}
                  controls={true}
                  onProgress={handleProgress}
                  onReady={() => setIsReady(true)}
                  config={{
                    youtube: {
                      embedOptions: {
                        modestbranding: 1,
                        rel: 0,
                      },
                    },
                  }}
                />
              </div>

              {/* Video Info */}
              <div className="mt-4">
                <h1 className="text-xl font-bold text-foreground mb-2">
                  {videoInfo?.title || "Chargement..."}
                </h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-red-500" />
                    <span>{videoInfo?.channelTitle || "YouTube"}</span>
                  </div>
                  {videoInfo?.publishedAt && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                      <span>
                        {new Date(videoInfo.publishedAt).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Playlist Navigation */}
              {playlistId && playlistVideos && (
                <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <button
                    onClick={() => prevVideo && navigateToVideo(prevVideo.id)}
                    disabled={!prevVideo}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-sm hidden sm:inline">Précédente</span>
                  </button>

                  <div className="text-center">
                    <span className="text-sm text-muted-foreground">
                      Vidéo {currentIndex + 1} sur {playlistVideos.length}
                    </span>
                  </div>

                  <button
                    onClick={() => nextVideo && navigateToVideo(nextVideo.id)}
                    disabled={!nextVideo}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span className="text-sm hidden sm:inline">Suivante</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Notes Panel */}
            {showNotes && (
              <div className="lg:h-[calc(100vh-200px)] bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <YouTubeNotesPanel
                  youtubeVideoId={videoId}
                  currentTime={currentTime}
                  onSeek={handleSeek}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
