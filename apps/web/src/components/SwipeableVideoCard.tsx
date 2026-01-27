"use client";

import { Trash2, Archive, Heart, Share2, Play, Clock } from "lucide-react";
import SwipeableCard, { SwipeActionConfig } from "./SwipeableCard";
import { useTranslation } from "@/i18n";

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

interface SwipeableVideoCardProps {
  video: Video;
  onArchive?: (id: string) => void;
  onLike?: (id: string) => void;
  onShare?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
}

export default function SwipeableVideoCard({
  video,
  onArchive,
  onLike,
  onShare,
  onDelete,
  onClick,
}: SwipeableVideoCardProps) {
  const { t, locale } = useTranslation();

  const leadingActions: SwipeActionConfig[] = [
    {
      icon: Archive,
      label: t.common.archive,
      color: "bg-blue-500",
      onClick: () => onArchive?.(video.id) ?? console.log("Archive", video.id),
    },
    {
      icon: Heart,
      label: t.common.like,
      color: "bg-pink-500",
      onClick: () => onLike?.(video.id) ?? console.log("Like", video.id),
    },
  ];

  const trailingActions: SwipeActionConfig[] = [
    {
      icon: Share2,
      label: t.common.share,
      color: "bg-emerald-500",
      onClick: () => onShare?.(video.id) ?? console.log("Share", video.id),
    },
    {
      icon: Trash2,
      label: t.common.delete,
      color: "bg-red-500",
      onClick: () => onDelete?.(video.id) ?? console.log("Delete", video.id),
      destructive: true,
    },
  ];

  const dateLocale = locale === "fr" ? "fr-FR" : "en-US";

  return (
    <SwipeableCard
      leadingActions={leadingActions}
      trailingActions={trailingActions}
      onClick={() => onClick?.(video.id) ?? console.log("Navigate to video", video.id)}
    >
      <div className="group w-full backdrop-blur-xl bg-card dark:bg-white/10 border border-border dark:border-white/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 dark:hover:bg-white/15">
        <div className="flex flex-col sm:flex-row">
          <div className="relative sm:w-72 aspect-video sm:aspect-[16/10] overflow-hidden">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-xs font-medium">
              <Clock className="w-3 h-3" />
              {video.duration}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300 opacity-0 group-hover:opacity-100">
              <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <Play
                  className="w-7 h-7 text-foreground ml-1"
                  fill="currentColor"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {video.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {video.description}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-primary-foreground text-xs font-bold shadow-md">
                  {video.channelTitle.charAt(0)}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {video.channelTitle}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {video.views && (
                  <span className="flex items-center gap-1">
                    <span className="font-semibold text-foreground">
                      {video.views}
                    </span>{" "}
                    {t.common.views}
                  </span>
                )}
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                <span>
                  {new Date(video.publishedAt).toLocaleDateString(dateLocale, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SwipeableCard>
  );
}
