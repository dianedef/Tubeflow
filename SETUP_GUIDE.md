# Setup Guide - Video Player + Notes

## Important: Convex Setup Required

Le backend Convex nécessite une authentification interactive que je ne peux pas faire automatiquement.

### Étape 1: Configurer Convex Backend

```bash
cd packages/backend
npm run setup
```

Vous verrez:
```
? Welcome to Convex! Would you like to login to your account?
  Start without an account (run Convex locally)
❯ Login or create an account
```

**Choisissez**: `Login or create an account`

Suivez les instructions:
1. Un code apparaîtra (ex: VGWB-NWGK)
2. Visitez l'URL donnée dans votre navigateur
3. Entrez le code
4. Authentifiez-vous avec GitHub/Google/Email

Une fois connecté, Convex va:
- Créer un nouveau projet (ou utiliser un existant)
- Déployer le schema
- Générer les types TypeScript automatiquement
- Créer `.env.local` avec `CONVEX_DEPLOYMENT`

### Étape 2: Configurer Clerk (Authentification)

1. Allez sur https://clerk.com et créez un compte
2. Créez une nouvelle application
3. Copiez vos clés API

4. Dans `apps/web/.env.local`:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

5. Dans `apps/native/.env.local`:
```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### Étape 3: Configurer Convex Environment Variables

Allez dans le dashboard Convex (https://dashboard.convex.dev):

1. Sélectionnez votre projet
2. Allez dans "Settings" → "Environment Variables"
3. Ajoutez:
   - `CLERK_ISSUER_URL` = votre URL Clerk (ex: https://your-app.clerk.accounts.dev)
   - `OPENAI_API_KEY` = votre clé OpenAI (optionnel, pour résumés)

### Étape 4: Vérifier l'Installation

```bash
# Vérifier que les types sont générés
ls packages/backend/convex/_generated/

# Devrait montrer:
# - api.d.ts (avec module "notes")
# - dataModel.d.ts
# - server.d.ts
```

### Étape 5: Lancer le Dev Server

```bash
# Depuis la racine du projet
npm run dev
```

Cela lance:
- Web app: http://localhost:3000
- Convex dev: Synchronisation en temps réel
- Native app: Expo dev server

### Étape 6: Tester

1. Ouvrez http://localhost:3000/videos/create
2. Ajoutez une vidéo YouTube (ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ)
3. Regardez la vidéo et prenez des notes avec timestamps!

## Dépannage

### "api.notes is not defined"
- Vérifiez que `convex dev` est en cours d'exécution
- Regardez `packages/backend/convex/_generated/api.d.ts`
- Vérifiez que `notes.ts` est dans `packages/backend/convex/`

### "Unauthorized" dans la console
- Vérifiez vos clés Clerk dans `.env.local`
- Vérifiez `CLERK_ISSUER_URL` dans Convex dashboard
- Essayez de vous déconnecter/reconnecter

### Video ne se charge pas
- Vérifiez que l'URL est valide (YouTube, Vimeo supportés)
- Regardez la console browser pour erreurs CORS
- Testez avec une autre vidéo

### Types TypeScript manquants
```bash
cd packages/backend
npx convex dev
# Laissez tourner, les types se régénèrent automatiquement
```

## Architecture

```
tubeflow/
├── packages/backend/           # Convex backend
│   ├── convex/
│   │   ├── schema.ts          # Tables: videos, notes, comments, likes
│   │   ├── videos.ts          # Video CRUD functions
│   │   ├── notes.ts           # Notes CRUD functions (NEW!)
│   │   └── _generated/        # Types auto-générés
│   └── .env.local             # CONVEX_DEPLOYMENT (créé par setup)
│
├── apps/web/                   # Next.js app
│   ├── src/
│   │   ├── app/videos/        # Pages vidéos (NEW!)
│   │   │   ├── page.tsx       # Liste vidéos
│   │   │   ├── create/        # Créer vidéo
│   │   │   └── [id]/          # Regarder vidéo + notes
│   │   └── components/videos/ # Composants vidéos (NEW!)
│   │       ├── VideoPlayer.tsx
│   │       └── NotesPanel.tsx
│   └── .env.local             # Clerk + Convex URL
│
└── apps/native/                # React Native app
    └── .env.local             # Clerk + Convex URL
```

## Prochaines Étapes

Une fois que tout fonctionne:

1. **Améliorer la navigation**: Ajouter `/videos` dans le menu principal
2. **Seek functionality**: Cliquer sur timestamp pour sauter dans la vidéo
3. **Export notes**: Exporter les notes en PDF/Markdown
4. **Thumbnails auto**: Extraire les thumbnails des vidéos automatiquement
5. **Recherche**: Chercher dans les notes et vidéos
6. **Partage**: Partager des vidéos avec notes entre utilisateurs

## Support

- Convex docs: https://docs.convex.dev
- Clerk docs: https://clerk.com/docs
- React Player: https://github.com/cookpete/react-player

Bon développement! 🚀
