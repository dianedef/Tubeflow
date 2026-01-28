"use client";

import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Play, Pause } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { Progress } from "@/components/ui/progress";

interface VideoPlayerProps {
  url: string;
  onTimeUpdate?: (seconds: number) => void;
}

export default function VideoPlayer({ url, onTimeUpdate }: VideoPlayerProps) {
  const playerRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.duration > 0) {
      setProgress((video.currentTime / video.duration) * 100);
    }
    onTimeUpdate?.(video.currentTime);
  };

  return (
    <div className="w-full">
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <ReactPlayer
          ref={playerRef}
          src={url}
          width="100%"
          height="100%"
          playing={playing}
          controls={true}
          onTimeUpdate={handleTimeUpdate}
        />
      </div>

      <div className="mt-2 flex items-center gap-4">
        <IconButton
          variant="primary"
          size="default"
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </IconButton>
        <Progress value={progress} className="flex-1" />
      </div>
    </div>
  );
}

export { type VideoPlayerProps };
