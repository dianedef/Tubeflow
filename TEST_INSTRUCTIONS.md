# Testing Video Player + Notes

## Prerequisites
1. Convex backend must be deployed and configured
2. Clerk authentication must be set up
3. Environment variables must be configured

## Test Steps

### 1. Start Development Server
```bash
# From project root
npm run dev
```

This will start:
- Web app on http://localhost:3000
- Convex backend (if .env.local is configured)

### 2. Test Video Creation
1. Navigate to http://localhost:3000/videos/create
2. Enter a video URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)
3. Add title and description
4. Click "Create Video"
5. Should redirect to video watch page

### 3. Test Video Playback
1. Video should load and be playable
2. Play/pause button should work
3. Progress bar should update as video plays
4. Current time should display

### 4. Test Notes
1. **Create Note Without Timestamp**
   - Uncheck "Include timestamp"
   - Type note content
   - Click "Add Note"
   - Note should appear in list

2. **Create Note With Timestamp**
   - Start playing video
   - Pause at a specific time
   - Check "Include timestamp"
   - Add note content
   - Click "Add Note"
   - Note should show timestamp (e.g., "1:23")

3. **Delete Note**
   - Click "Delete" on any note
   - Note should be removed

### 5. Test Videos List
1. Navigate to http://localhost:3000/videos
2. Should see list of your videos
3. Click on a video card to open watch page

## Expected Behavior

### VideoPlayer Component
- ✅ Loads videos from YouTube, Vimeo, Dailymotion, etc.
- ✅ Shows play/pause button
- ✅ Displays progress bar
- ✅ Tracks current playback time
- ✅ Responsive (works on mobile)

### NotesPanel Component
- ✅ Shows all notes for current video
- ✅ Can add notes with/without timestamps
- ✅ Timestamps formatted as MM:SS
- ✅ Notes ordered by creation time (newest first)
- ✅ Can delete notes
- ✅ Notes are user-specific (private)

## Troubleshooting

### "Loading video..." forever
- Check Convex connection in browser console
- Verify video ID is valid
- Check that videos table has data

### "No notes yet" but notes were added
- Check browser console for API errors
- Verify Convex authentication is working
- Check that userId matches in database

### Video won't play
- Verify URL is from supported platform (YouTube, Vimeo, etc.)
- Check browser console for CORS errors
- Try different video URL

### TypeScript errors
- Run: `cd packages/backend && npx convex dev` to regenerate types
- Check that all Convex functions are exported correctly
- Verify schema matches function signatures

## Manual Database Check

Using Convex dashboard:
1. Go to your deployment dashboard
2. Navigate to "Data" tab
3. Check `videos` table for your entries
4. Check `notes` table for note entries
5. Verify `userId` and `videoId` relationships

## Quick Test Video URLs

- YouTube: https://www.youtube.com/watch?v=dQw4w9WgXcQ
- Vimeo: https://vimeo.com/90509568
- Dailymotion: https://www.dailymotion.com/video/x5e9eog
- SoundCloud: https://soundcloud.com/miami-nights-1984/accelerated
