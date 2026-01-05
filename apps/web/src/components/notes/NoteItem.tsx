import Link from "next/link";
import { api } from "../../../packages/backend/convex/_generated/api";
import { useMutation } from "convex/react";

interface NoteItemProps {
  note: {
    _id: string;
    title: string;
    description: string;
    thumbnailUrl?: string;
    views: number;
    _creationTime: number;
  };
}

export function NoteItem({ note }: NoteItemProps) {
  const deleteVideo = useMutation(api.videos.deleteVideo);

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <Link href={`/videos/${note._id}`} className="flex-1">
          {note.thumbnailUrl && (
            <img
              src={note.thumbnailUrl}
              alt={note.title}
              className="w-full h-32 object-cover rounded mb-2"
            />
          )}
          <h3 className="font-semibold text-lg">{note.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {note.description}
          </p>
          <p className="text-xs text-gray-500">{note.views} views</p>
        </Link>
        <button
          onClick={() => deleteVideo({ id: note._id })}
          className="ml-4 text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

const NoteItem = ({ note, deleteNote }: NoteProps) => {
  return (
    <div className="flex justify-between items-center h-[74px] bg-[#F9FAFB] py-5 px-5 sm:px-11 gap-x-5 sm:gap-x-10">
      <Link href={`/notes/${note._id}`} className="flex-1">
        <h1 className=" text-[#2D2D2D] text-[17px] sm:text-2xl not-italic font-normal leading-[114.3%] tracking-[-0.6px]">
          {note.title}
        </h1>
        <p className="text-sm text-gray-600">
          {note.description.substring(0, 100)}...
        </p>
        <p className="text-xs text-gray-500">{note.views} views</p>
      </Link>
      <p className="hidden md:flex text-[#2D2D2D] text-center text-xl not-italic font-extralight leading-[114.3%] tracking-[-0.5px]">
        {new Date(Number(note._creationTime)).toLocaleDateString()}
      </p>
      <DeleteNote deleteAction={() => deleteNote({ id: note._id })} />
    </div>
  );
};

export default NoteItem;
