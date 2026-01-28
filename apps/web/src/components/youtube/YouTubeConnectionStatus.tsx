"use client";

import { useState, useEffect } from "react";
import { Youtube, CheckCircle, RefreshCw, LogIn } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { useAuth, useUser, SignInButton } from "@clerk/clerk-react";
import YouTubeConnectPrompt from "./YouTubeConnectPrompt";
import YouTubeDisconnectButton from "./YouTubeDisconnectButton";
import { useTranslation } from "@/i18n";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const youtubeApi = (api as any).youtube as Record<string, any> | undefined;

// Hook to detect client-side mount (avoids SSR/SSG issues)
function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

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
  const mounted = useIsMounted();

  // Avoid SSR — return null during server rendering
  if (!mounted) return null;

  return (
    <YouTubeConnectionStatusInner
      showDisconnect={showDisconnect}
      compact={compact}
      className={className}
    />
  );
}

function YouTubeConnectionStatusInner({
  showDisconnect = false,
  compact = false,
  className = "",
}: YouTubeConnectionStatusProps) {
  const { isSignedIn, isLoaded } = useUser();
  const connectionStatus = useQuery(
    isSignedIn && youtubeApi ? youtubeApi.getYoutubeConnectionStatus : undefined
  ) as { connected: boolean } | undefined;
  const { t } = useTranslation();

  if (!isLoaded) return null;

  // Not signed into Clerk — delegate to YouTubeConnectPrompt which shows sign-in
  if (!isSignedIn) {
    if (compact) {
      return <YouTubeConnectPrompt variant="inline" className={className} />;
    }
    return null;
  }

  if (connectionStatus === undefined) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {t.youtubeStatus.checkingConnection}
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

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Youtube className="w-5 h-5 text-red-500" />
          <CheckCircle className="w-3 h-3 text-green-500 absolute -bottom-0.5 -right-0.5 bg-background rounded-full" />
        </div>
        <span className="text-sm text-foreground">{t.youtubeStatus.connected}</span>
      </div>
      {showDisconnect && <YouTubeDisconnectButton variant="link" />}
    </div>
  );
}

interface YouTubeConnectBannerProps {
  onConnect?: () => void;
  className?: string;
}

export function YouTubeConnectBanner({
  onConnect,
  className = "",
}: YouTubeConnectBannerProps) {
  const mounted = useIsMounted();

  // Avoid SSR — return null during server rendering
  if (!mounted) return null;

  return <YouTubeConnectBannerInner onConnect={onConnect} className={className} />;
}

function YouTubeConnectBannerInner({
  onConnect,
  className = "",
}: YouTubeConnectBannerProps) {
  const { isSignedIn, isLoaded } = useUser();
  const { sessionId } = useAuth();
  const connectionStatus = useQuery(
    isSignedIn && youtubeApi ? youtubeApi.getYoutubeConnectionStatus : undefined
  ) as { connected: boolean } | undefined;
  const { t } = useTranslation();

  if (!isLoaded) return null;

  // Not signed into Clerk — show sign-in banner
  if (!isSignedIn) {
    return (
      <div
        className={`p-4 mb-6 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary">
              <LogIn className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">
                {t.signInPrompt.bannerTitle}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.signInPrompt.bannerDesc}
              </p>
            </div>
          </div>
          <SignInButton mode="modal">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-colors">
              <LogIn className="w-4 h-4" />
              {t.signInPrompt.cta}
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  // Signed in but still loading YouTube status, or already connected
  if (connectionStatus === undefined || connectionStatus.connected) {
    return null;
  }

  // Signed in but YouTube not connected
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
              {t.youtubeStatus.connectAccount}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t.youtubeStatus.accessPlaylists}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if (!sessionId) return;
            onConnect?.();
            document.cookie = `clerk_session_id=${sessionId}; path=/; max-age=600; SameSite=Lax`;
            window.location.href = "/api/auth/youtube";
          }}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Youtube className="w-4 h-4" />
          {t.youtubeStatus.connect}
        </button>
      </div>
    </div>
  );
}
