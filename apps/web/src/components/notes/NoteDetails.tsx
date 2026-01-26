"use client";

import { api } from "@packages/backend/convex/_generated/api";
import { Id } from "@packages/backend/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import ComplexToggle from "../home/ComplexToggle";

interface NoteDetailsProps {
  noteId: Id<"videos">;
}

const NoteDetails = ({ noteId }: NoteDetailsProps) => {
  const [isSummary, setIsSummary] = useState(false);
  const currentVideo = useQuery(api.videos.getVideo, { id: noteId });
  const updateViews = useMutation(api.videos.updateVideoViews);

  if (!currentVideo) {
    return <div>Loading...</div>;
  }

  // Increment views on load
  updateViews({ id: noteId });

  return (
    <div className="container space-y-6 sm:space-y-9 py-20 px-[26px] sm:px-0">
      <div className="flex justify-center items-center">
        <ComplexToggle isSummary={isSummary} setIsSummary={setIsSummary} />
      </div>
      <h3 className="text-black text-center pb-5 text-xl sm:text-[32px] not-italic font-semibold leading-[90.3%] tracking-[-0.8px]">
        {currentVideo.title}
      </h3>
      <div className="mb-6">
        <video controls className="w-full h-64">
          <source src={currentVideo.videoUrl} type="video/mp4" />
        </video>
      </div>
      <p className="text-black text-xl sm:text-[28px] not-italic font-normal leading-[130.3%] tracking-[-0.7px]">
        {currentVideo.description}
      </p>
    </div>
  );
};

export default NoteDetails;
