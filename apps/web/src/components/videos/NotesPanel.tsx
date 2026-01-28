"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { Id } from "@packages/backend/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Trash } from "lucide-react";

interface Note {
  _id: Id<"notes">;
  content: string;
  timestamp?: number;
  createdAt: number;
  videoId: Id<"videos">;
}

interface NotesPanelProps {
  videoId: string;
  currentTime: number;
}

export default function NotesPanel({ videoId, currentTime }: NotesPanelProps) {
  const [content, setContent] = useState("");
  const [includeTimestamp, setIncludeTimestamp] = useState(true);

  const notes = useQuery(api.notes.getNotes, { videoId: videoId as Id<"videos"> }) as Note[] | undefined;
  const createNote = useMutation(api.notes.createNote);
  const deleteNote = useMutation(api.notes.deleteNote);

  const formatTime = (seconds?: number) => {
    if (!seconds && seconds !== 0) return "";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await createNote({
      videoId: videoId as any,
      content: content.trim(),
      timestamp: includeTimestamp ? currentTime : undefined,
    });
    setContent("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 p-6 bg-background rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4 text-foreground">Notes</h3>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a note..."
          className="w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-background"
          rows={3}
        />
        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={includeTimestamp}
              onChange={(e) => setIncludeTimestamp(e.target.checked)}
              className="rounded border-input"
            />
            <span>Include timestamp ({formatTime(currentTime)})</span>
          </label>
          <Button type="submit">Add Note</Button>
        </div>
      </form>

      <div className="space-y-3">
        {notes?.map((note) => (
          <div
            key={note._id}
            className="p-4 bg-muted rounded-lg border border-border"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                {note.timestamp !== undefined && (
                  <div className="text-primary font-mono text-sm font-semibold mb-1">
                    {formatTime(note.timestamp)}
                  </div>
                )}
                <p className="text-foreground whitespace-pre-wrap">
                  {note.content}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
              <IconButton
                variant="ghost"
                size="sm"
                onClick={() => deleteNote({ id: note._id })}
                aria-label="Delete note"
              >
                <Trash className="h-4 w-4" />
              </IconButton>
            </div>
          </div>
        ))}
        {!notes?.length && (
          <p className="text-center text-muted-foreground py-8">
            No notes yet. Add your first note!
          </p>
        )}
      </div>
    </div>
  );
}
