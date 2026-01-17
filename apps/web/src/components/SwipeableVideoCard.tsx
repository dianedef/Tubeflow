"use client";

import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  LeadingActions,
  TrailingActions,
  Type,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import { Trash2, Archive, Heart, Share2, Play, Clock } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  views: string;
}

interface SwipeableVideoCardProps {
  video: Video;
}

const ActionContent = ({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
}) => (
  <div
    className={`flex items-center justify-center gap-3 h-full px-6 ${color}`}
  >
    <Icon className="w-6 h-6 text-white" />
    <span className="text-white font-medium hidden sm:block">{label}</span>
  </div>
);

export default function SwipeableVideoCard({ video }: SwipeableVideoCardProps) {
  const leadingActions = () => (
    <LeadingActions>
      <SwipeAction onClick={() => console.log("Archive", video.id)}>
        <ActionContent icon={Archive} label="Archive" color="bg-blue-500" />
      </SwipeAction>
      <SwipeAction onClick={() => console.log("Like", video.id)}>
        <ActionContent icon={Heart} label="Like" color="bg-pink-500" />
      </SwipeAction>
    </LeadingActions>
  );

  const trailingActions = () => (
    <TrailingActions>
      <SwipeAction onClick={() => console.log("Share", video.id)}>
        <ActionContent icon={Share2} label="Share" color="bg-emerald-500" />
      </SwipeAction>
      <SwipeAction
        destructive={true}
        onClick={() => console.log("Delete", video.id)}
      >
        <ActionContent icon={Trash2} label="Delete" color="bg-red-500" />
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <SwipeableList type={Type.IOS} threshold={0.3} fullSwipe={false}>
      <SwipeableListItem
        leadingActions={leadingActions()}
        trailingActions={trailingActions()}
        onClick={() => console.log("Navigate to video", video.id)}
      >
        {/* Glassmorphism Card */}
        <div className="group w-full backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/15 dark:hover:bg-white/10">
          <div className="flex flex-col sm:flex-row">
            {/* Thumbnail */}
            <div className="relative sm:w-72 aspect-video sm:aspect-[16/10] overflow-hidden">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-xs font-medium">
                <Clock className="w-3 h-3" />
                {video.duration}
              </div>
              {/* Play overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300 opacity-0 group-hover:opacity-100">
                <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <Play className="w-7 h-7 text-gray-900 ml-1" fill="currentColor" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  {video.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                  {video.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Channel avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {video.channelTitle.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {video.channelTitle}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{video.views}</span> vues
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-400" />
                  <span>
                    {new Date(video.publishedAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SwipeableListItem>
    </SwipeableList>
  );
}
