"use client";

import { Youtube, CheckCircle, RefreshCw } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import YouTubeConnectPrompt from "./YouTubeConnectPrompt";
import YouTubeDisconnectButton from "./YouTubeDisconnectButton";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const youtubeApi = (api as any).youtube as Record<string, any> | undefined;

interface YouTubeConnectionStatusProps {
  showDisconnect?: boolean;
  compact?: boolean;
  className?: string;
}

export default function YouTubeConnectionStatus({
  showDisconnect = false,
  compact = false,
  className = "",
}: YouTubeConnectionStatusProps) {
  const connectionStatus = useQuery(youtubeApi?.getYoutubeConnectionStatus) as { connected: boolean } | undefined;

  // Loading state
  if (connectionStatus === undefined) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Vérification de la connexion...
        </span>
      </div>
    );
  }

  const { connected } = connectionStatus;

  if (!connected) {
    if (compact) {
      return <YouTubeConnectPrompt variant="inline" className={className} />;
    }
    return null;
  }

  // Connected state
  return (
    <div
      className={`flex items-center gap-3 ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <Youtube className="w-5 h-5 text-red-500" />
          <CheckCircle className="w-3 h-3 text-green-500 absolute -bottom-0.5 -right-0.5 bg-slate-900 rounded-full" />
        </div>
        <span className="text-sm text-foreground">YouTube connecté</span>
      </div>
      {showDisconnect && <YouTubeDisconnectButton variant="link" />}
    </div>
  );
}

/**
 * Banner component that shows when YouTube is not connected
 */
export function YouTubeConnectBanner({
  onConnect,
  className = "",
}: {
  onConnect?: () => void;
  className?: string;
}) {
  const connectionStatus = useQuery(youtubeApi?.getYoutubeConnectionStatus) as { connected: boolean } | undefined;

  // Don't show during loading or if connected
  if (connectionStatus === undefined || connectionStatus.connected) {
    return null;
  }

  return (
    <div
      className={`p-4 mb-6 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-600">
            <Youtube className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">
              Connectez votre compte YouTube
            </h3>
            <p className="text-sm text-muted-foreground">
              Accédez à vos playlists et prenez des notes sur vos vidéos
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            onConnect?.();
            window.location.href = "/api/auth/youtube";
          }}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Youtube className="w-4 h-4" />
          Connecter
        </button>
      </div>
    </div>
  );
}
