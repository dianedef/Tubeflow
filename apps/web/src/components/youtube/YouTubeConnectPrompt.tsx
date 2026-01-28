"use client";

import { Youtube, ExternalLink, Shield, RefreshCw, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth, useUser, SignInButton } from "@clerk/clerk-react";
import { useTranslation } from "@/i18n";

// Hook to detect client-side mount (avoids SSR/SSG issues)
function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

interface YouTubeConnectPromptProps {
  onConnect?: () => void;
  variant?: "full" | "compact" | "inline";
  className?: string;
}

export default function YouTubeConnectPrompt({
  onConnect,
  variant = "full",
  className = "",
}: YouTubeConnectPromptProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const mounted = useIsMounted();
  const { sessionId } = useAuth();
  const { isSignedIn, isLoaded } = useUser();
  const { t } = useTranslation();

  // Avoid SSR/SSG issues and Clerk loading flicker
  if (!mounted || !isLoaded) return null;

  // If user is not signed into Clerk, show sign-in prompt instead
  if (!isSignedIn) {
    return <SignInPrompt variant={variant} className={className} />;
  }

  const handleConnect = () => {
    if (!sessionId) return;
    setIsConnecting(true);
    onConnect?.();
    // Store session ID in a cookie so the OAuth callback can authenticate with Convex
    document.cookie = `clerk_session_id=${sessionId}; path=/; max-age=600; SameSite=Lax`;
    window.location.href = "/api/auth/youtube";
  };

  if (variant === "inline") {
    return (
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 ${className}`}
      >
        {isConnecting ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <Youtube className="w-4 h-4" />
        )}
        {isConnecting ? t.youtubeConnect.connecting : t.youtubeConnect.connectYoutube}
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={`p-4 rounded-xl bg-card dark:bg-white/5 border border-border dark:border-white/10 backdrop-blur-sm ${className}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-red-600">
            <Youtube className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {t.youtubeConnect.connectAccount}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t.youtubeConnect.toSeePlaylists}
            </p>
          </div>
        </div>
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {isConnecting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <ExternalLink className="w-4 h-4" />
          )}
          {isConnecting ? t.youtubeConnect.connectingInProgress : t.youtubeConnect.signInGoogle}
        </button>
      </div>
    );
  }

  // Full variant
  return (
    <div
      className={`max-w-md mx-auto p-6 rounded-2xl bg-card dark:bg-gradient-to-br dark:from-white/10 dark:to-white/5 border border-border dark:border-white/20 backdrop-blur-xl shadow-xl ${className}`}
    >
      <div className="text-center mb-6">
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 shadow-lg mb-4">
          <Youtube className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t.youtubeConnect.connectTitle}
        </h2>
        <p className="text-muted-foreground">
          {t.youtubeConnect.connectDesc}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <Feature
          icon="playlist"
          title={t.youtubeConnect.yourPlaylists}
          description={t.youtubeConnect.yourPlaylistsDesc}
        />
        <Feature
          icon="notes"
          title={t.youtubeConnect.syncedNotes}
          description={t.youtubeConnect.syncedNotesDesc}
        />
        <Feature
          icon="secure"
          title={t.youtubeConnect.secureConnection}
          description={t.youtubeConnect.secureConnectionDesc}
        />
      </div>

      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isConnecting ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            {t.youtubeConnect.connectingInProgress}
          </>
        ) : (
          <>
            <Youtube className="w-5 h-5" />
            {t.youtubeConnect.signInYoutube}
          </>
        )}
      </button>

      <p className="mt-4 text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
        <Shield className="w-3 h-3" />
        {t.youtubeConnect.dataProtected}
      </p>
    </div>
  );
}

function SignInPrompt({
  variant,
  className = "",
}: {
  variant: "full" | "compact" | "inline";
  className?: string;
}) {
  const { t } = useTranslation();

  if (variant === "inline") {
    return (
      <SignInButton mode="modal">
        <button
          className={`inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors ${className}`}
        >
          <LogIn className="w-4 h-4" />
          {t.signInPrompt.cta}
        </button>
      </SignInButton>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={`p-4 rounded-xl bg-card dark:bg-white/5 border border-border dark:border-white/10 backdrop-blur-sm ${className}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-primary">
            <LogIn className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {t.signInPrompt.compactTitle}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t.signInPrompt.compactDesc}
            </p>
          </div>
        </div>
        <SignInButton mode="modal">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors">
            <LogIn className="w-4 h-4" />
            {t.signInPrompt.cta}
          </button>
        </SignInButton>
      </div>
    );
  }

  // Full variant
  return (
    <div
      className={`max-w-md mx-auto p-6 rounded-2xl bg-card dark:bg-gradient-to-br dark:from-white/10 dark:to-white/5 border border-border dark:border-white/20 backdrop-blur-xl shadow-xl ${className}`}
    >
      <div className="text-center mb-6">
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg mb-4">
          <LogIn className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t.signInPrompt.title}
        </h2>
        <p className="text-muted-foreground">
          {t.signInPrompt.desc}
        </p>
      </div>

      <SignInButton mode="modal">
        <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-all shadow-lg hover:shadow-xl">
          <LogIn className="w-5 h-5" />
          {t.signInPrompt.cta}
        </button>
      </SignInButton>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: "playlist" | "notes" | "secure";
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary dark:bg-white/5">
      <div className="p-1.5 rounded-md bg-red-600/20 text-red-400">
        {icon === "playlist" && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        )}
        {icon === "notes" && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
        {icon === "secure" && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        )}
      </div>
      <div>
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
