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
| `subscriptions` | Abonnements utilisateur (Polar) | userId, plan, status, polarCustomerId, polarSubscriptionId |
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
- `by_polar_customer_id` - Lookup subscription par Polar customer
- `by_polar_subscription_id` - Lookup subscription par Polar subscription

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
| `upsertSubscription` | Internal Mutation | Crée/met à jour depuis webhook Polar |
| `updateSubscriptionStatus` | Internal Mutation | Met à jour le statut depuis webhook Polar |
| `linkCustomerToUser` | Internal Mutation | Lie un customer Polar à un utilisateur |
| `cancelSubscription` | Mutation | Marque l'abonnement comme à annuler |
| `getPlans` | Query | Liste tous les plans disponibles |
| `getPolarCheckoutInfo` | Query | Récupère les infos pour le checkout Polar |

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
| `/polar-webhook` | POST | Webhook Polar pour gestion des abonnements |

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

---

## Intégration Polar (Paiements)

### Overview

TubeFlow utilise [Polar](https://polar.sh) pour la gestion des abonnements et paiements. Polar fournit une plateforme de monétisation adaptée aux SaaS.

### Événements Webhook Polar

Le webhook `/polar-webhook` gère les événements suivants :

| Événement | Action |
|-----------|--------|
| `subscription.created` | Crée/met à jour l'abonnement |
| `subscription.updated` | Met à jour l'abonnement |
| `subscription.active` | Active l'abonnement |
| `subscription.canceled` | Marque comme annulé |
| `subscription.revoked` | Révoque et downgrade à free |
| `subscription.past_due` | Marque comme impayé |
| `customer.created` | Lie le customer à l'utilisateur |

### Flux d'abonnement

```
┌─────────────────────────────────────────────────────────────┐
│                     UTILISATEUR                              │
│  1. Clique "Upgrade to Pro" sur /preferences                │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ 2. Redirigé vers Polar Checkout
               ▼
┌─────────────────────────────────────────────────────────────┐
│                        POLAR                                 │
│  - Affiche le formulaire de paiement                        │
│  - Traite le paiement                                       │
│  - Crée le customer & subscription                          │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ 3. Webhook events
               ▼
┌─────────────────────────────────────────────────────────────┐
│                 CONVEX (/polar-webhook)                      │
│  - Vérifie la signature du webhook                          │
│  - Trouve l'utilisateur par email                           │
│  - Crée/met à jour la subscription                          │
│  - Active les features Pro/Team                             │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ 4. Real-time update
               ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND                                  │
│  - useQuery(api.subscriptions.getSubscription) se met à jour│
│  - UI reflète le nouveau plan                               │
│  - Features Pro débloquées                                  │
└─────────────────────────────────────────────────────────────┘
```

### Mapping Produits Polar → Plans

Dans `convex/http.ts`, configure le mapping entre tes Product IDs Polar et les plans :

```typescript
function mapPolarProductToPlan(productId: string): "free" | "pro" | "team" {
  const productMap: Record<string, "free" | "pro" | "team"> = {
    "prod_xxx": "pro",   // Remplace par ton Product ID Pro
    "prod_yyy": "team",  // Remplace par ton Product ID Team
  };

  return productMap[productId] ?? "pro";
}
```

### Utilisation dans le Frontend

#### Afficher le plan actuel

```tsx
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";

function SubscriptionStatus() {
  const subscription = useQuery(api.subscriptions.getSubscription);

  if (!subscription) return <Loading />;

  return (
    <div>
      <p>Plan: {subscription.plan}</p>
      <p>Status: {subscription.status}</p>
      {subscription.cancelAtPeriodEnd && (
        <p>Sera annulé à la fin de la période</p>
      )}
    </div>
  );
}
```

#### Bouton Upgrade avec Polar

```tsx
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";

function UpgradeButton() {
  const checkoutInfo = useQuery(api.subscriptions.getPolarCheckoutInfo);

  const handleUpgrade = () => {
    // Utilise le Polar SDK ou redirige vers ton checkout link
    // avec l'email pré-rempli pour lier automatiquement
    window.location.href = `https://polar.sh/checkout/YOUR_PRODUCT_ID?email=${checkoutInfo?.email}`;
  };

  return (
    <button onClick={handleUpgrade}>
      Upgrade to Pro
    </button>
  );
}
```

### Structure de la table subscriptions

```typescript
{
  userId: string,              // Clerk user ID
  plan: "free" | "pro" | "team",
  status: "active" | "canceled" | "past_due" | "trialing" | "revoked",
  polarCustomerId: string,     // Polar customer ID
  polarSubscriptionId: string, // Polar subscription ID
  polarProductId: string,      // Polar product ID
  currentPeriodStart: number,  // Timestamp début période
  currentPeriodEnd: number,    // Timestamp fin période
  cancelAtPeriodEnd: boolean,  // Annulation programmée
  createdAt: number,
  updatedAt: number
}
```
