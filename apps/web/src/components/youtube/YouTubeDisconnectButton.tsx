"use client";

import { Youtube, RefreshCw } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const youtubeApi = (api as any).youtube as Record<string, any> | undefined;

interface YouTubeDisconnectButtonProps {
  onDisconnect?: () => void;
  variant?: "button" | "link" | "menu-item";
  className?: string;
}

export default function YouTubeDisconnectButton({
  onDisconnect,
  variant = "button",
  className = "",
}: YouTubeDisconnectButtonProps) {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const disconnectYoutube = useMutation(youtubeApi?.disconnectYoutube);

  const handleDisconnect = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsDisconnecting(true);
    try {
      await disconnectYoutube();
      onDisconnect?.();
      // Reload to refresh state
      window.location.reload();
    } catch (error) {
      console.error("Failed to disconnect YouTube:", error);
    } finally {
      setIsDisconnecting(false);
      setShowConfirm(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  if (variant === "link") {
    if (showConfirm) {
      return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
          <span className="text-sm text-muted-foreground">Confirmer ?</span>
          <button
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className="text-sm text-red-500 hover:text-red-400 transition-colors"
          >
            {isDisconnecting ? "..." : "Oui"}
          </button>
          <button
            onClick={handleCancel}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Non
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={handleDisconnect}
        className={`inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-colors ${className}`}
      >
        <LogOut className="w-3.5 h-3.5" />
        Déconnecter YouTube
      </button>
    );
  }

  if (variant === "menu-item") {
    if (showConfirm) {
      return (
        <div className={`flex items-center justify-between px-3 py-2 ${className}`}>
          <span className="text-sm text-foreground">Déconnecter ?</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDisconnecting ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Oui"}
            </button>
            <button
              onClick={handleCancel}
              className="px-2 py-1 text-xs bg-white/10 text-foreground rounded hover:bg-white/20 transition-colors"
            >
              Non
            </button>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={handleDisconnect}
        className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-white/5 transition-colors rounded-lg ${className}`}
      >
        <Youtube className="w-4 h-4 text-red-500" />
        <span>Déconnecter YouTube</span>
      </button>
    );
  }

  // Default button variant
  if (showConfirm) {
    return (
      <div
        className={`flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 ${className}`}
      >
        <span className="text-sm text-foreground flex-1">
          Confirmer la déconnexion de YouTube ?
        </span>
        <button
          onClick={handleDisconnect}
          disabled={isDisconnecting}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {isDisconnecting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            "Oui, déconnecter"
          )}
        </button>
        <button
          onClick={handleCancel}
          className="px-3 py-1.5 text-sm bg-white/10 text-foreground rounded-md hover:bg-white/20 transition-colors"
        >
          Annuler
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleDisconnect}
      className={`flex items-center gap-2 px-4 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-foreground rounded-lg transition-colors ${className}`}
    >
      <Youtube className="w-4 h-4 text-red-500" />
      Déconnecter YouTube
    </button>
  );
}
