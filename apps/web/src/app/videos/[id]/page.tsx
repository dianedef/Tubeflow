"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { Id } from "@packages/backend/convex/_generated/dataModel";
import VideoPlayer from "@/components/videos/VideoPlayer";
import NotesPanel from "@/components/videos/NotesPanel";
import { useTranslation } from "@/i18n";

export default function VideoWatchPage({ params }: { params: { id: string } }) {
  const videoId = params.id as Id<"videos">;
  const video = useQuery(api.videos.getVideo, { id: videoId });
  const [currentTime, setCurrentTime] = useState(0);
  const { t, locale } = useTranslation();

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">{t.videoDetail.loadingVideo}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-card rounded-lg shadow-lg p-6">
          <VideoPlayer url={video.videoUrl} onTimeUpdate={setCurrentTime} />

          <div className="mt-6">
            <h1 className="text-3xl font-bold text-foreground">
              {video.title}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span>
                {video.views} {t.common.views}
              </span>
              <span>{video.likes} likes</span>
              <span>
                {new Date(video.createdAt).toLocaleDateString(
                  locale === "fr" ? "fr-FR" : "en-US"
                )}
              </span>
            </div>
            {video.description && (
              <p className="mt-4 text-foreground whitespace-pre-wrap">
                {video.description}
              </p>
            )}
          </div>
        </div>

        <NotesPanel videoId={videoId} currentTime={currentTime} />
      </div>
    </div>
  );
}
