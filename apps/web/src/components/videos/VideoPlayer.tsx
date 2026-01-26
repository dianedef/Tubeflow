"use client";

import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Play, Pause } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { Progress } from "@/components/ui/progress";

interface OnProgressProps {
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
}

interface VideoPlayerProps {
  url: string;
  onTimeUpdate?: (seconds: number) => void;
}

export default function VideoPlayer({ url, onTimeUpdate }: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleProgress = (state: any) => {
    if (state && typeof state.played === "number") {
      setProgress(state.played * 100);
      if (onTimeUpdate && typeof state.playedSeconds === "number") {
        onTimeUpdate(state.playedSeconds);
      }
    }
  };

  const seekTo = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, "seconds");
    }
  };

  return (
    <div className="w-full">
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          playing={playing}
          controls={true}
          onProgress={handleProgress}
          config={{}}
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
