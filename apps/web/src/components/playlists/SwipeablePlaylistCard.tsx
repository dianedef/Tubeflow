"use client";

import { Trash2, Play, Share2, Edit, Lock, Globe } from "lucide-react";
import SwipeableCard, { SwipeActionConfig } from "../SwipeableCard";
import { useTranslation } from "@/i18n";

interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoCount: number;
  createdAt: string;
  isPublic: boolean;
}

interface SwipeablePlaylistCardProps {
  playlist: Playlist;
  onPlayAll?: (id: string) => void;
  onEdit?: (id: string) => void;
  onShare?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
}

export default function SwipeablePlaylistCard({
  playlist,
  onPlayAll,
  onEdit,
  onShare,
  onDelete,
  onClick,
}: SwipeablePlaylistCardProps) {
  const { t, locale } = useTranslation();

  const leadingActions: SwipeActionConfig[] = [
    {
      icon: Play,
      label: t.common.playAll,
      color: "bg-green-500",
      onClick: () => onPlayAll?.(playlist.id) ?? console.log("Play all", playlist.id),
    },
    {
      icon: Edit,
      label: t.common.edit,
      color: "bg-blue-500",
      onClick: () => onEdit?.(playlist.id) ?? console.log("Edit", playlist.id),
    },
  ];

  const trailingActions: SwipeActionConfig[] = [
    {
      icon: Share2,
      label: t.common.share,
      color: "bg-emerald-500",
      onClick: () => onShare?.(playlist.id) ?? console.log("Share", playlist.id),
    },
    {
      icon: Trash2,
      label: t.common.delete,
      color: "bg-red-500",
      onClick: () => onDelete?.(playlist.id) ?? console.log("Delete", playlist.id),
      destructive: true,
    },
  ];

  const dateLocale = locale === "fr" ? "fr-FR" : "en-US";
  const formattedDate = new Date(playlist.createdAt).toLocaleDateString(
    dateLocale,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <SwipeableCard
      leadingActions={leadingActions}
      trailingActions={trailingActions}
      onClick={() => onClick?.(playlist.id)}
    >
      <div className="group w-full backdrop-blur-xl bg-card dark:bg-white/10 border border-border dark:border-white/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 dark:hover:bg-white/15">
        <div className="flex flex-col sm:flex-row">
          <div className="relative sm:w-56 aspect-video overflow-hidden">
            <img
              src={playlist.thumbnailUrl}
              alt={playlist.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                <Play className="w-3 h-3" fill="currentColor" />
                {playlist.videoCount} {t.playlistDetail.videosCount}
              </span>
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
                {playlist.isPublic ? (
                  <Globe className="w-3 h-3" />
                ) : (
                  <Lock className="w-3 h-3" />
                )}
              </span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300 opacity-0 group-hover:opacity-100">
              <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <Play
                  className="w-6 h-6 text-foreground ml-0.5"
                  fill="currentColor"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {playlist.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {playlist.description}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    playlist.isPublic
                      ? "bg-gradient-to-br from-green-400 to-emerald-600"
                      : "bg-gradient-to-br from-gray-400 to-gray-600"
                  }`}
                />
                <span className="text-xs text-muted-foreground">
                  {playlist.isPublic ? t.common.public : t.common.private}
                </span>
              </div>

              <span className="text-xs text-muted-foreground">
                {t.playlistDetail.createdOn} {formattedDate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </SwipeableCard>
  );
}
