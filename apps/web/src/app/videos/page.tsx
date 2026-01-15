"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
}

interface Playlist {
  _id: string;
  name: string;
  videoIds: string[];
}

export default function VideosPage() {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  
  // These would need to be implemented in the backend
  const youtubeVideos = useQuery(api.youtube.getFeed) as YouTubeVideo[] | undefined;
  const playlists = useQuery(api.playlists.getPlaylists) as Playlist[] | undefined;
  const createPlaylist = useMutation(api.playlists.createPlaylist);
  const addToPlaylist = useMutation(api.playlists.addVideoToPlaylist);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    try {
      await createPlaylist({ name: newPlaylistName.trim() });
      setNewPlaylistName("");
    } catch (error) {
      console.error("Failed to create playlist:", error);
    }
  };

  const handleAddToPlaylist = async (videoId: string, playlistId: string) => {
    try {
      await addToPlaylist({ playlistId, videoId });
    } catch (error) {
      console.error("Failed to add video to playlist:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">YouTube Feed</h1>
          
          {/* Playlist Management */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Playlists</h2>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="New playlist name"
                className="flex-1 p-2 border rounded-lg"
              />
              <button
                onClick={handleCreatePlaylist}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create Playlist
              </button>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {playlists?.map((playlist) => (
                <button
                  key={playlist._id}
                  onClick={() => setSelectedPlaylist(
                    selectedPlaylist === playlist._id ? null : playlist._id
                  )}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedPlaylist === playlist._id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {playlist.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {!youtubeVideos ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading YouTube feed...</p>
          </div>
        ) : youtubeVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No videos found in your YouTube feed</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {youtubeVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                <div className="aspect-video bg-gray-200">
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{video.channelTitle}</span>
                    <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                  </div>
                  
                  {selectedPlaylist && (
                    <button
                      onClick={() => handleAddToPlaylist(video.id, selectedPlaylist)}
                      className="w-full px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition"
                    >
                      Add to Playlist
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
