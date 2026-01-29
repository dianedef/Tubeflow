"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
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
  Settings,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "@/i18n";
import type { Locale } from "@/i18n";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "fr", label: "Fran\u00e7ais" },
  { value: "es", label: "Espa\u00f1ol" },
  { value: "de", label: "Deutsch" },
  { value: "pt", label: "Portugu\u00eas" },
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
  const { t, locale, setLocale } = useTranslation();

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
      <main className="min-h-screen bg-background dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900/50 dark:to-slate-900">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 dark:bg-purple-500/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-primary/5 dark:bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-primary/5 dark:bg-pink-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <Header />
          <div className="container py-8">
            <div className="flex items-center justify-center min-h-[50vh]">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900/50 dark:to-slate-900">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 dark:bg-purple-500/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-primary/5 dark:bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-primary/5 dark:bg-pink-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <Header />
          <div className="container py-8">
            <h1 className="text-4xl font-bold mb-4">{t.preferencesPage.title}</h1>
            <p className="text-muted-foreground">
              {t.preferencesPage.signInRequired}
            </p>
          </div>
        </div>
      </main>
    );
  }

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
      // Update locale in the i18n system for immediate effect
      if (language === "en" || language === "fr") {
        setLocale(language as Locale);
      }
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
    <main className="min-h-screen bg-background dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900/50 dark:to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 dark:bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-primary/5 dark:bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-primary/5 dark:bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />

        <div className="container py-8 max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                {t.preferencesPage.title}
              </h1>
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
            <p className="text-muted-foreground text-sm ml-14">
              {t.preferencesPage.subtitle}
            </p>
          </div>

          <div className="space-y-6">
        {/* Account Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t.preferencesPage.accountTitle}
            </CardTitle>
            <CardDescription>{t.preferencesPage.accountDesc}</CardDescription>
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
              {t.preferencesPage.subscriptionTitle}
            </CardTitle>
            <CardDescription>{t.preferencesPage.subscriptionDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {t.preferencesPage.currentPlan}{" "}
                  <span className="text-primary capitalize">
                    {subscription?.plan ?? "Free"}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {t.preferencesPage.status} {subscription?.status ?? "Active"}
                </p>
              </div>
              {subscription?.plan === "free" && (
                <Button variant="default" onClick={handleUpgrade}>
                  {t.preferencesPage.upgradePro}
                </Button>
              )}
            </div>
            {subscription?.features && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  {t.preferencesPage.maxVideos}{" "}
                  {subscription.features.maxVideos === -1
                    ? t.preferencesPage.unlimited
                    : subscription.features.maxVideos}
                </div>
                <div>
                  {t.preferencesPage.maxPlaylists}{" "}
                  {subscription.features.maxPlaylists === -1
                    ? t.preferencesPage.unlimited
                    : subscription.features.maxPlaylists}
                </div>
                <div>
                  {t.preferencesPage.aiSummaries}{" "}
                  {subscription.features.aiSummaries
                    ? t.common.yes
                    : t.common.no}
                </div>
                <div>
                  {t.preferencesPage.exportNotes}{" "}
                  {subscription.features.exportNotes
                    ? t.common.yes
                    : t.common.no}
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
              {t.preferencesPage.appearanceTitle}
            </CardTitle>
            <CardDescription>
              {t.preferencesPage.appearanceDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>{t.preferencesPage.theme}</Label>
              <div className="flex gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("light")}
                  disabled={isSaving}
                >
                  <Sun className="h-4 w-4 mr-2" />
                  {t.preferencesPage.light}
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("dark")}
                  disabled={isSaving}
                >
                  <Moon className="h-4 w-4 mr-2" />
                  {t.preferencesPage.dark}
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("system")}
                  disabled={isSaving}
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  {t.preferencesPage.system}
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>{t.preferencesPage.language}</Label>
              <Select
                value={locale}
                onValueChange={handleLanguageChange}
                disabled={isSaving}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={t.preferencesPage.selectLanguage} />
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
              {t.preferencesPage.notificationsTitle}
            </CardTitle>
            <CardDescription>
              {t.preferencesPage.notificationsDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t.preferencesPage.emailNotifications}</Label>
                <p className="text-sm text-muted-foreground">
                  {t.preferencesPage.emailNotificationsDesc}
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
                <Label>{t.preferencesPage.pushNotifications}</Label>
                <p className="text-sm text-muted-foreground">
                  {t.preferencesPage.pushNotificationsDesc}
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
                <Label>{t.preferencesPage.newComments}</Label>
                <p className="text-sm text-muted-foreground">
                  {t.preferencesPage.newCommentsDesc}
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
                <Label>{t.preferencesPage.newLikes}</Label>
                <p className="text-sm text-muted-foreground">
                  {t.preferencesPage.newLikesDesc}
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
              {t.preferencesPage.playbackTitle}
            </CardTitle>
            <CardDescription>{t.preferencesPage.playbackDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t.preferencesPage.autoplay}</Label>
                <p className="text-sm text-muted-foreground">
                  {t.preferencesPage.autoplayDesc}
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
                <Label>{t.preferencesPage.defaultQuality}</Label>
                <p className="text-sm text-muted-foreground">
                  {t.preferencesPage.defaultQualityDesc}
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
                  <SelectValue placeholder={t.preferencesPage.selectQuality} />
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
                <Label>{t.preferencesPage.defaultSpeed}</Label>
                <p className="text-sm text-muted-foreground">
                  {t.preferencesPage.defaultSpeedDesc}
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
                  <SelectValue placeholder={t.preferencesPage.selectSpeed} />
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
              {t.preferencesPage.notesTitle}
            </CardTitle>
            <CardDescription>{t.preferencesPage.notesDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t.preferencesPage.autoTimestamp}</Label>
                <p className="text-sm text-muted-foreground">
                  {t.preferencesPage.autoTimestampDesc}
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
                <Label>{t.preferencesPage.sortOrder}</Label>
                <p className="text-sm text-muted-foreground">
                  {t.preferencesPage.sortOrderDesc}
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
                  <SelectValue placeholder={t.preferencesPage.selectOrder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">
                    {t.preferencesPage.ascending}
                  </SelectItem>
                  <SelectItem value="desc">
                    {t.preferencesPage.descending}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
