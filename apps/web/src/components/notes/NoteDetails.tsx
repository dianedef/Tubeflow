"use client";

import { api } from "@packages/backend/convex/_generated/api";
import { Id } from "@packages/backend/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../packages/backend/convex/_generated/api";
import { useState } from "react";

interface NoteDetailsProps {
  noteId: Id<"videos">;
}

export function NoteDetails({ noteId }: NoteDetailsProps) {
  const video = useQuery(api.videos.getVideo, { id: noteId });
  const updateViews = useMutation(api.videos.updateVideoViews);
  const [showDescription, setShowDescription] = useState(true);

  if (!video) {
    return <div>Loading...</div>;
  }

  // Increment views on load
  updateViews({ id: noteId });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
      <div className="mb-6">
        <video controls className="w-full h-64 bg-black">
          <source src={video.videoUrl} type="video/mp4" />
        </video>
      </div>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowDescription(true)}
          className={`px-4 py-2 rounded ${showDescription ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Description
        </button>
        <button
          onClick={() => setShowDescription(false)}
          className={`px-4 py-2 rounded ${!showDescription ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Comments
        </button>
      </div>
      <div className="prose max-w-none">
        {showDescription ? (
          <p>{video.description}</p>
        ) : (
          <div>Comments placeholder</div>
        )}
      </div>
    </div>
  );
}

const NoteDetails = ({ noteId }: NoteDetailsProps) => {
  const [isSummary, setIsSummary] = useState(false);
  const currentVideo = useQuery(api.videos.getVideo, { id: noteId });

  return (
    <div className="container space-y-6 sm:space-y-9 py-20 px-[26px] sm:px-0">
      <div className="flex justify-center items-center">
        <ComplexToggle isSummary={isSummary} setIsSummary={setIsSummary} />
      </div>
      <h3 className="text-black text-center pb-5 text-xl sm:text-[32px] not-italic font-semibold leading-[90.3%] tracking-[-0.8px]">
        {currentVideo?.title}
      </h3>
      <div className="mb-6">
        <video controls className="w-full h-64">
          <source src={currentVideo?.videoUrl} type="video/mp4" />
        </video>
      </div>
      <p className="text-black text-xl sm:text-[28px] not-italic font-normal leading-[130.3%] tracking-[-0.7px]">
        {currentVideo?.description}
      </p>
    </div>
  );
};

export default NoteDetails;
