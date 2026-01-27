"use client";

import { Trash2, Pin, Edit, Clock } from "lucide-react";
import SwipeableCard, { SwipeActionConfig } from "../SwipeableCard";
import { useTranslation } from "@/i18n";

interface Note {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  views: number;
  _creationTime: number;
}

interface SwipeableNoteCardProps {
  note: Note;
  onPin?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
  badge?: string;
}

export default function SwipeableNoteCard({
  note,
  onPin,
  onEdit,
  onDelete,
  onClick,
  badge,
}: SwipeableNoteCardProps) {
  const { t, locale } = useTranslation();

  const leadingActions: SwipeActionConfig[] = [
    {
      icon: Pin,
      label: t.common.pin,
      color: "bg-amber-500",
      onClick: () => onPin?.(note._id) ?? console.log("Pin", note._id),
    },
  ];

  const trailingActions: SwipeActionConfig[] = [
    {
      icon: Edit,
      label: t.common.edit,
      color: "bg-blue-500",
      onClick: () => onEdit?.(note._id) ?? console.log("Edit", note._id),
    },
    {
      icon: Trash2,
      label: t.common.delete,
      color: "bg-red-500",
      onClick: () => onDelete?.(note._id) ?? console.log("Delete", note._id),
      destructive: true,
    },
  ];

  const dateLocale = locale === "fr" ? "fr-FR" : "en-US";
  const formattedDate = new Date(Number(note._creationTime)).toLocaleDateString(
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
      onClick={() => onClick?.(note._id)}
    >
      <div className="group w-full backdrop-blur-xl bg-card dark:bg-white/10 border border-border dark:border-white/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 dark:hover:bg-white/15 cursor-pointer">
        <div className="flex flex-col sm:flex-row">
          {note.thumbnailUrl && (
            <div className="relative sm:w-48 aspect-video sm:aspect-square overflow-hidden">
              <img
                src={note.thumbnailUrl}
                alt={note.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              {badge && (
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {badge}
                </div>
              )}
            </div>
          )}

          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {note.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {note.description}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formattedDate}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-orange-500 to-red-600" />
                <span className="text-xs text-muted-foreground">
                  {t.common.note}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SwipeableCard>
  );
}
