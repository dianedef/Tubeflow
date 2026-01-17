# TubeFlow Documentation

## User Preferences & Data Architecture

### Overview

TubeFlow utilise une architecture complète pour gérer les données utilisateur avec Convex comme backend temps réel et Clerk pour l'authentification.

### Database Schema

#### Tables

| Table | Description | Champs principaux |
|-------|-------------|-------------------|
| `users` | Utilisateurs synchronisés depuis Clerk | clerkId, email, name, avatarUrl, createdAt, updatedAt |
| `settings` | Préférences utilisateur | userId, theme, language, notifications, playback, notes |
| `playlists` | Playlists de vidéos | userId, name, description, videoIds, isPublic |
| `subscriptions` | Abonnements utilisateur | userId, plan, status, stripeCustomerId |
| `videos` | Vidéos sauvegardées | userId, title, description, videoUrl, views, likes |
| `notes` | Notes timestampées | videoId, userId, content, timestamp |
| `channels` | Profils de chaînes | userId, name, description, avatarUrl |
| `comments` | Commentaires vidéo | videoId, userId, content |
| `likes` | Likes/dislikes | videoId, userId, type |

#### Indexes

Toutes les tables utilisent des index optimisés pour les requêtes fréquentes :
- `by_user_id` - Filtrage par utilisateur
- `by_video_id` - Filtrage par vidéo
- `by_clerk_id` - Lookup utilisateur depuis Clerk ID

---

### Backend Convex Functions

#### Users (`convex/users.ts`)

| Fonction | Type | Description |
|----------|------|-------------|
| `getCurrentUser` | Query | Récupère l'utilisateur connecté |
| `getUserByClerkId` | Query | Récupère un utilisateur par son Clerk ID |
| `ensureUser` | Mutation | Crée l'utilisateur s'il n'existe pas (appelé au login) |
| `updateProfile` | Mutation | Met à jour le profil (name, avatarUrl) |
| `upsertUser` | Internal Mutation | Crée/met à jour depuis webhook Clerk |
| `deleteUser` | Internal Mutation | Supprime utilisateur depuis webhook Clerk |

#### Settings (`convex/settings.ts`)

| Fonction | Type | Description |
|----------|------|-------------|
| `getSettings` | Query | Récupère les préférences de l'utilisateur |
| `updateTheme` | Mutation | Met à jour le thème (light/dark/system) |
| `updateLanguage` | Mutation | Met à jour la langue |
| `updateNotifications` | Mutation | Met à jour les préférences de notifications |
| `updatePlayback` | Mutation | Met à jour les paramètres de lecture |
| `updateNotesSettings` | Mutation | Met à jour les paramètres de notes |
| `updateAllSettings` | Mutation | Met à jour tous les paramètres d'un coup |

**Structure des Settings :**

```typescript
{
  theme: "light" | "dark" | "system",
  language: "en" | "fr" | "es" | "de" | "pt",
  notifications: {
    email: boolean,
    push: boolean,
    newComments: boolean,
    newLikes: boolean
  },
  playback: {
    autoplay: boolean,
    defaultQuality: "auto" | "1080p" | "720p" | "480p" | "360p",
    defaultSpeed: 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2
  },
  notes: {
    defaultTimestamped: boolean,
    sortOrder: "asc" | "desc"
  }
}
```

#### Playlists (`convex/playlists.ts`)

| Fonction | Type | Description |
|----------|------|-------------|
| `getPlaylists` | Query | Liste les playlists de l'utilisateur |
| `getPlaylist` | Query | Récupère une playlist par ID |
| `getPlaylistWithVideos` | Query | Récupère une playlist avec les détails des vidéos |
| `createPlaylist` | Mutation | Crée une nouvelle playlist |
| `updatePlaylist` | Mutation | Met à jour une playlist |
| `addVideoToPlaylist` | Mutation | Ajoute une vidéo à une playlist |
| `removeVideoFromPlaylist` | Mutation | Retire une vidéo d'une playlist |
| `reorderPlaylistVideos` | Mutation | Réordonne les vidéos dans une playlist |
| `deletePlaylist` | Mutation | Supprime une playlist |
| `getPublicPlaylists` | Query | Liste les playlists publiques |

#### Subscriptions (`convex/subscriptions.ts`)

| Fonction | Type | Description |
|----------|------|-------------|
| `getSubscription` | Query | Récupère l'abonnement de l'utilisateur avec ses features |
| `getSubscriptionLimits` | Query | Récupère les limites du plan actuel |
| `checkLimit` | Query | Vérifie si une action est autorisée selon le plan |
| `updateSubscription` | Internal Mutation | Met à jour depuis webhook Stripe |
| `cancelSubscription` | Mutation | Annule l'abonnement |
| `getPlans` | Query | Liste tous les plans disponibles |

**Plans disponibles :**

| Plan | Max Videos | Max Notes/Video | Max Playlists | AI Summaries | Export |
|------|------------|-----------------|---------------|--------------|--------|
| Free | 10 | 50 | 3 | Non | Non |
| Pro | 100 | 500 | 20 | Oui | Oui |
| Team | Illimité | Illimité | Illimité | Oui | Oui |

#### HTTP Endpoints (`convex/http.ts`)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/clerk-webhook` | POST | Webhook Clerk pour sync des utilisateurs |

---

### Frontend - Page Préférences

**Route :** `/preferences`

**Sections :**

1. **Account** - Affiche les infos du compte Clerk (photo, nom, email)

2. **Subscription** - Affiche le plan actuel et ses limites, bouton upgrade

3. **Appearance** - Sélection du thème et de la langue

4. **Notifications** - Toggles pour les différents types de notifications

5. **Playback** - Configuration de l'autoplay, qualité par défaut, vitesse

6. **Notes** - Auto-timestamp et ordre de tri des notes

**Composants UI utilisés :**
- `Card` - Conteneur pour chaque section
- `Switch` - Toggles pour les options booléennes
- `Select` - Dropdowns pour les sélections
- `Button` - Actions (changement de thème, upgrade)
- `Label` - Labels pour les champs
- `Separator` - Séparateurs visuels

---

### Flux de données

```
┌─────────────────────────────────────────────────────────────┐
│                        CLERK                                 │
│  (Authentification externe)                                  │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ 1. User login/signup
               │ 2. Webhook events (user.created, user.updated, user.deleted)
               ▼
┌─────────────────────────────────────────────────────────────┐
│                    CONVEX BACKEND                            │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   users     │  │  settings   │  │   subscriptions     │  │
│  │  (synced)   │◄─┤  (prefs)    │  │   (plans/billing)   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│         │                │                    │              │
│         └────────────────┼────────────────────┘              │
│                          │                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   videos    │  │   notes     │  │     playlists       │  │
│  │             │◄─┤ (timestamped│◄─┤  (video collections)│  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
               │
               │ Real-time subscriptions (useQuery)
               │ Mutations (useMutation)
               ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS FRONTEND                          │
│                                                              │
│  - ConvexProvider (wraps app)                               │
│  - ClerkProvider (auth context)                             │
│  - ThemeProvider (next-themes)                              │
│                                                              │
│  Pages:                                                      │
│  - /preferences (settings UI)                               │
│  - /videos/[id] (player + notes)                            │
│  - /playlists (playlist management)                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### Utilisation dans le code

#### Récupérer les settings

```tsx
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";

function MyComponent() {
  const settings = useQuery(api.settings.getSettings);

  if (!settings) return <Loading />;

  return (
    <div>
      Theme: {settings.theme}
      Language: {settings.language}
    </div>
  );
}
```

#### Mettre à jour un setting

```tsx
import { useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";

function ThemeToggle() {
  const updateTheme = useMutation(api.settings.updateTheme);

  const handleChange = async (theme: "light" | "dark" | "system") => {
    await updateTheme({ theme });
  };

  return <button onClick={() => handleChange("dark")}>Dark Mode</button>;
}
```

#### Vérifier les limites d'abonnement

```tsx
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";

function CreateVideoButton({ currentCount }: { currentCount: number }) {
  const limitCheck = useQuery(api.subscriptions.checkLimit, {
    feature: "videos",
    currentCount,
  });

  if (!limitCheck?.allowed) {
    return <UpgradePrompt reason={limitCheck?.reason} />;
  }

  return <button>Create Video</button>;
}
```

#### Gérer les playlists

```tsx
import { useQuery, useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";

function PlaylistManager() {
  const playlists = useQuery(api.playlists.getPlaylists);
  const createPlaylist = useMutation(api.playlists.createPlaylist);
  const addVideo = useMutation(api.playlists.addVideoToPlaylist);

  const handleCreate = async () => {
    await createPlaylist({ name: "Ma Playlist", isPublic: false });
  };

  const handleAddVideo = async (playlistId: Id<"playlists">, videoId: Id<"videos">) => {
    await addVideo({ playlistId, videoId });
  };

  return (
    <div>
      {playlists?.map(p => <PlaylistCard key={p._id} playlist={p} />)}
    </div>
  );
}
```

#### Assurer la création de l'utilisateur au login

```tsx
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";

function UserSync() {
  const { user, isLoaded } = useUser();
  const ensureUser = useMutation(api.users.ensureUser);

  useEffect(() => {
    if (isLoaded && user) {
      ensureUser({
        email: user.primaryEmailAddress?.emailAddress ?? "",
        name: user.fullName ?? undefined,
        avatarUrl: user.imageUrl ?? undefined,
      });
    }
  }, [isLoaded, user, ensureUser]);

  return null;
}
```
