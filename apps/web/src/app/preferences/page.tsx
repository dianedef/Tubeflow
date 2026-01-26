"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sun,
  Moon,
  Monitor,
  Bell,
  Play,
  FileText,
  User,
  CreditCard,
  Loader2,
} from "lucide-react";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
  { value: "de", label: "Deutsch" },
  { value: "pt", label: "Português" },
];

const PLAYBACK_SPEEDS = [
  { value: "0.5", label: "0.5x" },
  { value: "0.75", label: "0.75x" },
  { value: "1", label: "1x (Normal)" },
  { value: "1.25", label: "1.25x" },
  { value: "1.5", label: "1.5x" },
  { value: "1.75", label: "1.75x" },
  { value: "2", label: "2x" },
];

const VIDEO_QUALITIES = [
  { value: "auto", label: "Auto" },
  { value: "1080p", label: "1080p" },
  { value: "720p", label: "720p" },
  { value: "480p", label: "480p" },
  { value: "360p", label: "360p" },
];

export default function PreferencesPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { theme, setTheme } = useTheme();

  const settings = useQuery(api.settings.getSettings);
  const subscription = useQuery(api.subscriptions.getSubscription);

  const updateTheme = useMutation(api.settings.updateTheme);
  const updateLanguage = useMutation(api.settings.updateLanguage);
  const updateNotifications = useMutation(api.settings.updateNotifications);
  const updatePlayback = useMutation(api.settings.updatePlayback);
  const updateNotesSettings = useMutation(api.settings.updateNotesSettings);
  const ensureUser = useMutation(api.users.ensureUser);

  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure user exists in Convex on first load
  useEffect(() => {
    if (isUserLoaded && user) {
      ensureUser({
        email: user.primaryEmailAddress?.emailAddress ?? "",
        name: user.fullName ?? undefined,
        avatarUrl: user.imageUrl ?? undefined,
      });
    }
  }, [isUserLoaded, user, ensureUser]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isUserLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Preferences</h1>
        <p className="text-muted-foreground">
          Please sign in to access preferences.
        </p>
      </div>
    );
  }

  // Use default settings if not loaded yet
  const currentSettings = settings || {
    theme: "system" as const,
    language: "en",
    notifications: {
      email: true,
      push: true,
      newComments: true,
      newLikes: false,
    },
    playback: {
      autoplay: true,
      defaultQuality: "auto",
      defaultSpeed: 1,
    },
    notes: {
      defaultTimestamped: true,
      sortOrder: "asc" as const,
    },
  };

  const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
    setIsSaving(true);
    try {
      setTheme(newTheme);
      await updateTheme({ theme: newTheme });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLanguageChange = async (language: string) => {
    setIsSaving(true);
    try {
      await updateLanguage({ language });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationToggle = async (
    key: "email" | "push" | "newComments" | "newLikes",
    value: boolean,
  ) => {
    setIsSaving(true);
    try {
      const currentNotifications = currentSettings.notifications ?? {
        email: true,
        push: true,
        newComments: true,
        newLikes: false,
      };
      await updateNotifications({
        notifications: {
          ...currentNotifications,
          [key]: value,
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePlaybackChange = async (
    key: "autoplay" | "defaultQuality" | "defaultSpeed",
    value: boolean | string | number,
  ) => {
    setIsSaving(true);
    try {
      const currentPlayback = currentSettings.playback ?? {
        autoplay: true,
        defaultQuality: "auto",
        defaultSpeed: 1,
      };
      await updatePlayback({
        playback: {
          ...currentPlayback,
          [key]: value,
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotesChange = async (
    key: "defaultTimestamped" | "sortOrder",
    value: boolean | "asc" | "desc",
  ) => {
    setIsSaving(true);
    try {
      const currentNotes = currentSettings.notes ?? {
        defaultTimestamped: true,
        sortOrder: "asc" as const,
      };
      await updateNotesSettings({
        notes: {
          ...currentNotes,
          [key]: value,
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpgrade = () => {
    const userEmail = user.primaryEmailAddress?.emailAddress;
    const baseUrl = process.env.NEXT_PUBLIC_POLAR_CHECKOUT_URL || "https://buy.polar.sh/polar_cl_wySaNRREvnRTpGDpsFjkuxSY0HHCxQUz4tiGc0vAgzk";
    const checkoutUrl = `${baseUrl}${userEmail ? `?customer_email=${encodeURIComponent(userEmail)}` : ""}`;
    window.location.href = checkoutUrl;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Preferences</h1>
        <p className="text-muted-foreground">
          Customize your TubeFlow experience
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account
            </CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {user.imageUrl && (
                <img
                  src={user.imageUrl}
                  alt={user.fullName ?? "Profile"}
                  className="h-16 w-16 rounded-full"
                />
              )}
              <div>
                <p className="font-medium">{user.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription
            </CardTitle>
            <CardDescription>Manage your subscription plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  Current Plan:{" "}
                  <span className="text-primary capitalize">
                    {subscription?.plan ?? "Free"}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Status: {subscription?.status ?? "Active"}
                </p>
              </div>
              {subscription?.plan === "free" && (
                <Button variant="default" onClick={handleUpgrade}>
                  Upgrade to Pro
                </Button>
              )}
            </div>
            {subscription?.features && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  Max Videos:{" "}
                  {subscription.features.maxVideos === -1
                    ? "Unlimited"
                    : subscription.features.maxVideos}
                </div>
                <div>
                  Max Playlists:{" "}
                  {subscription.features.maxPlaylists === -1
                    ? "Unlimited"
                    : subscription.features.maxPlaylists}
                </div>
                <div>
                  AI Summaries:{" "}
                  {subscription.features.aiSummaries ? "Yes" : "No"}
                </div>
                <div>
                  Export Notes:{" "}
                  {subscription.features.exportNotes ? "Yes" : "No"}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how TubeFlow looks on your device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Theme</Label>
              <div className="flex gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("light")}
                  disabled={isSaving}
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("dark")}
                  disabled={isSaving}
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("system")}
                  disabled={isSaving}
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  System
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Language</Label>
              <Select
                value={currentSettings.language ?? "en"}
                onValueChange={handleLanguageChange}
                disabled={isSaving}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Choose what notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={currentSettings.notifications?.email ?? true}
                onCheckedChange={(checked) =>
                  handleNotificationToggle("email", checked)
                }
                disabled={isSaving}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications in your browser
                </p>
              </div>
              <Switch
                checked={currentSettings.notifications?.push ?? true}
                onCheckedChange={(checked) =>
                  handleNotificationToggle("push", checked)
                }
                disabled={isSaving}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Comments</Label>
                <p className="text-sm text-muted-foreground">
                  Notify when someone comments on your videos
                </p>
              </div>
              <Switch
                checked={currentSettings.notifications?.newComments ?? true}
                onCheckedChange={(checked) =>
                  handleNotificationToggle("newComments", checked)
                }
                disabled={isSaving}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Likes</Label>
                <p className="text-sm text-muted-foreground">
                  Notify when someone likes your videos
                </p>
              </div>
              <Switch
                checked={currentSettings.notifications?.newLikes ?? false}
                onCheckedChange={(checked) =>
                  handleNotificationToggle("newLikes", checked)
                }
                disabled={isSaving}
              />
            </div>
          </CardContent>
        </Card>

        {/* Playback Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Playback
            </CardTitle>
            <CardDescription>Configure video playback settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Autoplay</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically play videos when you open them
                </p>
              </div>
              <Switch
                checked={currentSettings.playback?.autoplay ?? true}
                onCheckedChange={(checked) =>
                  handlePlaybackChange("autoplay", checked)
                }
                disabled={isSaving}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="space-y-0.5">
                <Label>Default Quality</Label>
                <p className="text-sm text-muted-foreground">
                  Preferred video quality when available
                </p>
              </div>
              <Select
                value={currentSettings.playback?.defaultQuality ?? "auto"}
                onValueChange={(value) =>
                  handlePlaybackChange("defaultQuality", value)
                }
                disabled={isSaving}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  {VIDEO_QUALITIES.map((quality) => (
                    <SelectItem key={quality.value} value={quality.value}>
                      {quality.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="space-y-0.5">
                <Label>Default Playback Speed</Label>
                <p className="text-sm text-muted-foreground">
                  Default speed for video playback
                </p>
              </div>
              <Select
                value={String(currentSettings.playback?.defaultSpeed ?? 1)}
                onValueChange={(value) =>
                  handlePlaybackChange("defaultSpeed", parseFloat(value))
                }
                disabled={isSaving}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select speed" />
                </SelectTrigger>
                <SelectContent>
                  {PLAYBACK_SPEEDS.map((speed) => (
                    <SelectItem key={speed.value} value={speed.value}>
                      {speed.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notes
            </CardTitle>
            <CardDescription>Configure note-taking preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-timestamp Notes</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically add video timestamp when creating notes
                </p>
              </div>
              <Switch
                checked={currentSettings.notes?.defaultTimestamped ?? true}
                onCheckedChange={(checked) =>
                  handleNotesChange("defaultTimestamped", checked)
                }
                disabled={isSaving}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="space-y-0.5">
                <Label>Notes Sort Order</Label>
                <p className="text-sm text-muted-foreground">
                  How to sort notes by timestamp
                </p>
              </div>
              <Select
                value={currentSettings.notes?.sortOrder ?? "asc"}
                onValueChange={(value) =>
                  handleNotesChange("sortOrder", value as "asc" | "desc")
                }
                disabled={isSaving}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending (oldest first)</SelectItem>
                  <SelectItem value="desc">
                    Descending (newest first)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
      <Header />
    </div>
  );
}
