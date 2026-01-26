# YouTube Clone MVP Tasks

## 1. Define Scope & Features (1-2 days)

- [x] Define core features: video upload placeholder, feed/watch pages, search by title, user channels, comments, likes/views
- [x] Plan video handling: YouTube API integration later; use placeholders for now
- [x] Confirm UI/UX: responsive feed, mobile-first for native

## 2. Update Backend (Convex Schema & Functions) (3-5 days)

- [x] Update packages/backend/convex/schema.ts: replace notes with videos (userId, title, description, videoUrl placeholder, thumbnailUrl, views, likes), add channels, comments, likes tables
- [x] Rename/update packages/backend/convex/notes.ts to videos.ts: modify queries (getVideos, getVideo) and mutations (createVideo, deleteVideo)
- [x] Add comments.ts and likes.ts for CRUD functions
- [x] Update openai.ts for optional video descriptions (placeholder)

## 3. Update Web App (Next.js) (5-7 days)

- [x] Update apps/web/src/app/ pages: replace /notes with /videos (feed), /videos/[id] (watch), /upload, /channels/[userId]
- [x] Update layout for video nav (header/footer with search/upload)
- [x] Adapt components: Notes.tsx → VideoFeed.tsx, NoteDetails.tsx → VideoPlayer.tsx, CreateNote.tsx → UploadVideo.tsx
- [ ] Add new components: VideoCard.tsx, CommentSection.tsx, LikeButton.tsx
- [x] Integrate react-player for video playback

## 4. Update Native App (Expo/React Native) (5-7 days)

- [ ] Update screens: NotesDashboardScreen.tsx → VideosFeedScreen.tsx, InsideNoteScreen.tsx → VideoWatchScreen.tsx, CreateNoteScreen.tsx → UploadVideoScreen.tsx
- [ ] Add screens: ChannelScreen.tsx, CommentModal.tsx
- [ ] Update Navigation.tsx for video routes
- [ ] Adapt components to StyleSheet; use expo-av for playback
- [ ] Use Expo DocumentPicker for upload placeholders

## 5. Shared & Cross-Platform Enhancements (3-5 days)

- [ ] Extend Clerk for channel profiles
- [ ] Adapt search logic to videos
- [ ] Ensure real-time updates for comments/likes
- [ ] Run typecheck/lint across workspaces

## 6. Testing, Polish & Launch (2-3 days)

- [ ] Integration tests: dev run, test playback on web/native
- [ ] Performance optimizations
- [ ] Error handling for placeholders
- [ ] Prepare for YouTube API integration

**Notes**: Focus on front-end UI/UX with placeholders. YouTube API for fetching videos added later. Commit this file after each major update.

## 🔮 Roadmap - Prochaines Fonctionnalités

### Phase 1 (Court terme)
- [ ] Click timestamp pour seek dans la vidéo
- [ ] Recherche dans les notes
- [ ] Export notes en Markdown/PDF
- [ ] Raccourcis clavier (space = pause, etc.)

### Phase 2 (Moyen terme)
- [ ] Extraction automatique des thumbnails
- [ ] Détection automatique des chapitres vidéo
- [ ] Notes collaboratives (partage)
- [ ] Tags et catégories

### Phase 3 (Long terme)
- [ ] Transcription audio automatique (Whisper)
- [ ] AI Summary des vidéos
- [ ] Annotations visuelles sur la timeline
- [ ] Support streaming live
