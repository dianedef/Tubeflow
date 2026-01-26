"use client";

import { api } from "@packages/backend/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SwipeableNoteCard from "./SwipeableNoteCard";
import { YouTubeConnectBanner } from "@/components/youtube";
import { RefreshCw, FileText } from "lucide-react";

const Notes = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Fetch notes with video info from Convex
  const notesWithVideoInfo = useQuery(api.notes.getAllNotesWithVideoInfo);
  const deleteNote = useMutation(api.notes.deleteNote);

  const isLoading = notesWithVideoInfo === undefined;

  // Filter notes based on search
  const filteredNotes = notesWithVideoInfo
    ? notesWithVideoInfo.filter(
        (note) =>
          note.content?.toLowerCase().includes(search.toLowerCase()) ||
          note.videoInfo?.title?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // Transform notes for SwipeableNoteCard
  const transformedNotes = filteredNotes.map((note) => ({
    _id: note._id,
    title: note.videoInfo?.title || "Vidéo sans titre",
    description: note.content,
    thumbnailUrl:
      note.videoInfo?.thumbnailUrl ||
      "https://via.placeholder.com/300x200",
    views: 0,
    _creationTime: note.createdAt,
    timestamp: note.timestamp,
    youtubeVideoId: note.youtubeVideoId,
    videoId: note.videoId,
    isYoutube: note.videoInfo?.isYoutube ?? false,
  }));

  const handlePin = (id: string) => {
    console.log("Pin note", id);
    // TODO: Implement pin functionality
  };

  const handleEdit = (id: string) => {
    const note = transformedNotes.find((n) => n._id === id);
    if (note?.youtubeVideoId) {
      // Navigate to the video with the note timestamp
      const url = `/videos/watch/${note.youtubeVideoId}${note.timestamp ? `?t=${note.timestamp}` : ""}`;
      router.push(url);
    } else if (note?.videoId) {
      router.push(`/videos/${note.videoId}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette note ?")) {
      try {
        await deleteNote({ id: id as any });
      } catch (error) {
        console.error("Failed to delete note:", error);
        alert("Erreur lors de la suppression de la note");
      }
    }
  };

  const handleNoteClick = (id: string) => {
    const note = transformedNotes.find((n) => n._id === id);
    if (note?.youtubeVideoId) {
      // Navigate to the video at the note's timestamp
      const url = `/videos/watch/${note.youtubeVideoId}${note.timestamp ? `?t=${note.timestamp}` : ""}`;
      router.push(url);
    } else if (note?.videoId) {
      router.push(`/videos/${note.videoId}`);
    }
  };

  // Format timestamp for display
  const formatTimestamp = (seconds: number | undefined): string => {
    if (seconds === undefined) return "";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="container pb-10">
      {/* YouTube connect banner */}
      <YouTubeConnectBanner className="mb-6" />

      <div className="px-5 sm:px-0">
        <div className="bg-card/50 backdrop-blur-sm flex items-center h-[39px] sm:h-[55px] rounded-xl border border-white/20 gap-2 sm:gap-5 mb-8 px-3 sm:px-6">
          <Image
            src="/images/search.svg"
            width={23}
            height={22}
            alt="search"
            className="cursor-pointer sm:w-[23px] sm:h-[22px] w-[20px] h-[20px] opacity-70"
          />
          <input
            type="text"
            placeholder="Rechercher dans les notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-[15px] sm:text-lg not-italic font-light leading-[114.3%] tracking-[-0.4px] focus:outline-0 focus:ring-0 focus:border-0 border-0 bg-transparent placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin" />
        </div>
      )}

      {/* Notes list */}
      {!isLoading && (
        <>
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm sm:hidden">
            <p className="text-sm text-foreground text-center">
              👈 Swipe gauche/droite pour les actions 👉
            </p>
          </div>

          <div className="space-y-4">
            {transformedNotes.map((note) => (
              <SwipeableNoteCard
                key={note._id}
                note={{
                  _id: note._id,
                  title: note.title,
                  description: note.description,
                  thumbnailUrl: note.thumbnailUrl,
                  views: note.views,
                  _creationTime: note._creationTime,
                }}
                onPin={handlePin}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onClick={handleNoteClick}
                badge={
                  note.timestamp !== undefined
                    ? formatTimestamp(note.timestamp)
                    : undefined
                }
              />
            ))}
          </div>

          {transformedNotes.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary-foreground mb-2">
                Aucune note
              </h3>
              <p className="text-muted-foreground">
                {search
                  ? "Aucune note ne correspond à votre recherche"
                  : "Regardez une vidéo et prenez des notes pour les voir ici"}
              </p>
            </div>
          )}
        </>
      )}

      {transformedNotes.length > 0 && (
        <div className="mt-8 text-center text-muted-foreground text-sm">
          <p>Swipe gauche pour modifier/supprimer • Swipe droite pour épingler</p>
        </div>
      )}
    </div>
  );
};

export default Notes;
