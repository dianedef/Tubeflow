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
    <Icon className="w-6 h-6 text-primary-foreground" />
    <span className="text-primary-foreground font-medium hidden sm:block">
      {label}
    </span>
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
        <div className="group w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/15">
          <div className="flex flex-col sm:flex-row">
            <div className="relative sm:w-72 aspect-video sm:aspect-[16/10] overflow-hidden">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-xs font-medium">
                <Clock className="w-3 h-3" />
                {video.duration}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300 opacity-0 group-hover:opacity-100">
                <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <Play
                    className="w-7 h-7 text-foreground ml-1"
                    fill="currentColor"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
                  {video.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {video.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-primary-foreground text-xs font-bold shadow-md">
                    {video.channelTitle.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {video.channelTitle}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="font-semibold text-foreground">
                      {video.views}
                    </span>{" "}
                    vues
                  </span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
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
