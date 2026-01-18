"use client";

import { Youtube, ExternalLink, Shield, RefreshCw } from "lucide-react";
import { useState } from "react";

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

  const handleConnect = () => {
    setIsConnecting(true);
    onConnect?.();
    // Redirect to OAuth endpoint
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
        {isConnecting ? "Connexion..." : "Connecter YouTube"}
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={`p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm ${className}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-red-600">
            <Youtube className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Connectez votre compte YouTube
            </h3>
            <p className="text-sm text-muted-foreground">
              Pour voir vos playlists et vidéos
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
          {isConnecting ? "Connexion en cours..." : "Se connecter avec Google"}
        </button>
      </div>
    );
  }

  // Full variant
  return (
    <div
      className={`max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl shadow-xl ${className}`}
    >
      <div className="text-center mb-6">
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 shadow-lg mb-4">
          <Youtube className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Connectez YouTube
        </h2>
        <p className="text-muted-foreground">
          Accédez à vos playlists YouTube directement dans TubeFlow pour prendre
          des notes sur vos vidéos préférées.
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <Feature
          icon="playlist"
          title="Vos playlists"
          description="Accédez à toutes vos playlists YouTube"
        />
        <Feature
          icon="notes"
          title="Notes synchronisées"
          description="Prenez des notes horodatées sur vos vidéos"
        />
        <Feature
          icon="secure"
          title="Connexion sécurisée"
          description="OAuth 2.0 - vos identifiants restent privés"
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
            Connexion en cours...
          </>
        ) : (
          <>
            <Youtube className="w-5 h-5" />
            Se connecter avec YouTube
          </>
        )}
      </button>

      <p className="mt-4 text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
        <Shield className="w-3 h-3" />
        Vos données sont protégées et ne sont jamais partagées
      </p>
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
    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
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
