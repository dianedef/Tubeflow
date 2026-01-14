"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { Id } from "@packages/backend/convex/_generated/dataModel";

interface Note {
  _id: Id<"notes">;
  content: string;
  timestamp?: number;
  createdAt: number;
}

interface NotesPanelProps {
  videoId: Id<"videos">;
  currentTime: number;
}

export default function NotesPanel({ videoId, currentTime }: NotesPanelProps) {
  const [content, setContent] = useState("");
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  
  const notes = useQuery(api.notes.getNotes, { videoId }) as Note[] | undefined;
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
      videoId,
      content: content.trim(),
      timestamp: includeTimestamp ? currentTime : undefined,
    });
    setContent("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 p-6 bg-white rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Notes</h3>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a note..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
        />
        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeTimestamp}
              onChange={(e) => setIncludeTimestamp(e.target.checked)}
              className="rounded"
            />
            <span>Include timestamp ({formatTime(currentTime)})</span>
          </label>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Add Note
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {notes?.map((note) => (
          <div key={note._id} className="p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                {note.timestamp !== undefined && (
                  <div className="text-blue-600 font-mono text-sm font-semibold mb-1">
                    {formatTime(note.timestamp)}
                  </div>
                )}
                <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => deleteNote({ id: note._id })}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!notes?.length && (
          <p className="text-center text-gray-500 py-8">No notes yet. Add your first note!</p>
        )}
      </div>
    </div>
  );
}
