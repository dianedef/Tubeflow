"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import Link from "next/link";

interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  views: number;
  likes: number;
}

export default function VideosPage() {
  const videos = useQuery(api.videos.getVideos) as Video[] | undefined;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Videos</h1>
          <Link
            href="/videos/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + New Video
          </Link>
        </div>

        {!videos ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No videos yet. Create your first video!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link
                key={video._id}
                href={`/videos/${video._id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  {video.thumbnailUrl ? (
                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-400">No thumbnail</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {video.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{video.views} views</span>
                    <span>{video.likes} likes</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
