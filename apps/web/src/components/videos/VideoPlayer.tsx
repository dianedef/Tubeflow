"use client";

import { useRef, useState } from "react";
import ReactPlayer from "react-player";

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
    if (state && typeof state.played === 'number') {
      setProgress(state.played * 100);
      if (onTimeUpdate && typeof state.playedSeconds === 'number') {
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
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
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
        <button
          onClick={() => setPlaying(!playing)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {playing ? "Pause" : "Play"}
        </button>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export { type VideoPlayerProps };
