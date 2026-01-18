"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Trash, Clock, Send, FileText } from "lucide-react";

interface YouTubeNotesPanelProps {
  youtubeVideoId: string;
  currentTime: number;
  onSeek?: (seconds: number) => void;
}

export default function YouTubeNotesPanel({
  youtubeVideoId,
  currentTime,
  onSeek,
}: YouTubeNotesPanelProps) {
  const [content, setContent] = useState("");
  const [includeTimestamp, setIncludeTimestamp] = useState(true);

  const notes = useQuery(api.notes.getNotesByYoutubeVideo, { youtubeVideoId });
  const createNote = useMutation(api.notes.createNoteForYoutubeVideo);
  const deleteNote = useMutation(api.notes.deleteNote);

  const formatTime = (seconds?: number) => {
    if (seconds === undefined || seconds === null) return "";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await createNote({
      youtubeVideoId,
      content: content.trim(),
      timestamp: includeTimestamp ? Math.floor(currentTime) : undefined,
    });
    setContent("");
  };

  const handleTimestampClick = (timestamp?: number) => {
    if (timestamp !== undefined && onSeek) {
      onSeek(timestamp);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-foreground">Notes</h3>
          <span className="text-sm text-muted-foreground">
            ({notes?.length ?? 0})
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Prenez une note..."
              className="w-full p-3 pr-12 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-foreground placeholder:text-muted-foreground"
              rows={3}
            />
            <button
              type="submit"
              disabled={!content.trim()}
              className="absolute right-2 bottom-2 p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-red-700 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={includeTimestamp}
                onChange={(e) => setIncludeTimestamp(e.target.checked)}
                className="rounded border-white/20 bg-white/5"
              />
              <Clock className="w-3.5 h-3.5" />
              <span>
                Inclure timestamp ({formatTime(Math.floor(currentTime))})
              </span>
            </label>
          </div>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notes?.map((note) => (
          <div
            key={note._id}
            className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                {note.timestamp !== undefined && (
                  <button
                    onClick={() => handleTimestampClick(note.timestamp)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 font-mono text-sm font-medium mb-2 hover:bg-orange-500/30 transition-colors"
                  >
                    <Clock className="w-3 h-3" />
                    {formatTime(note.timestamp)}
                  </button>
                )}
                <p className="text-foreground whitespace-pre-wrap text-sm">
                  {note.content}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(note.createdAt).toLocaleString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <IconButton
                variant="ghost"
                size="sm"
                onClick={() => deleteNote({ id: note._id })}
                aria-label="Supprimer la note"
                className="text-muted-foreground hover:text-red-500"
              >
                <Trash className="h-4 w-4" />
              </IconButton>
            </div>
          </div>
        ))}

        {notes?.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Aucune note pour cette vidéo.
              <br />
              Commencez à prendre des notes !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
