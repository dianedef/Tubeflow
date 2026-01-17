import Link from "next/link";
import { api } from "@packages/backend/convex/_generated/api";
import { useMutation } from "convex/react";
import DeleteNote from "./DeleteNote";

interface NoteProps {
  note: {
    _id: string;
    title: string;
    description: string;
    thumbnailUrl?: string;
    views: number;
    _creationTime: number;
  };
}

const NoteItem = ({ note }: NoteProps) => {
  const deleteVideo = useMutation(api.videos.deleteVideo);

  return (
    <div className="flex justify-between items-center h-[74px] bg-muted py-5 px-5 sm:px-11 gap-x-5 sm:gap-x-10">
      <Link href={`/notes/${note._id}`} className="flex-1">
        <h1 className=" text-foreground text-[17px] sm:text-2xl not-italic font-normal leading-[114.3%] tracking-[-0.6px]">
          {note.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {note.description.substring(0, 100)}...
        </p>
        <p className="text-xs text-muted-foreground">{note.views} views</p>
      </Link>
      <p className="hidden md:flex text-foreground text-center text-xl not-italic font-extralight leading-[114.3%] tracking-[-0.5px]">
        {new Date(Number(note._creationTime)).toLocaleDateString()}
      </p>
      <DeleteNote deleteAction={() => deleteVideo({ id: note._id })} />
    </div>
  );
};

export default NoteItem;
