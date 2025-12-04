# Voting and Images Fix ✅

## Problems Fixed

### 1. Images Not Visible in Gallery
**Issue**: Photos were stored in MongoDB but images weren't displaying in the frontend.

**Root Cause**: 
- Photos endpoint didn't include judge scores and visitor votes
- Image URLs were relative paths that needed to be converted to full URLs

**Solution**:
- Updated `photoService.ts` to fetch scores and votes for each photo
- Updated `transformers.ts` to properly construct full image URLs
- Images now display with format: `http://localhost:5000/uploads/filename.jpg`

### 2. Voting Error
**Issue**: Voting functionality was throwing errors.

**Root Cause**: 
- Backend expects `visitorId` in vote submission
- Frontend was sending `visitorEmail` and `visitorName` directly

**Solution**:
- Updated `voteService.ts` to first create/get visitor, then submit vote
- Two-step process:
  1. POST `/votes/visitors` with name and email → get visitorId
  2. POST `/votes` with photoId and visitorId → submit vote

## Files Modified

### 1. `src/services/photoService.ts`
```typescript
// Now fetches scores and votes for each photo
export const getAllPhotos = async () => {
  const photos = await api.get('/photos');
  // Fetch scores and votes for each photo
  // Calculate totalJudgeScore and visitorVotes
  return photosWithScores;
};
```

### 2. `src/services/voteService.ts`
```typescript
export const submitVote = async (photoId, visitorEmail, visitorName) => {
  // Step 1: Create/get visitor
  const visitor = await api.post('/votes/visitors', { name, email });
  const visitorId = visitor.data.data._id;
  
  // Step 2: Submit vote
  await api.post('/votes', { photoId, visitorId });
};
```

### 3. `src/utils/transformers.ts`
```typescript
export const transformPhoto = (backendPhoto) => {
  // Convert relative URLs to full URLs
  let imageUrl = backendPhoto.imageUrl;
  if (!imageUrl.startsWith('http')) {
    imageUrl = `http://localhost:5000${imageUrl}`;
  }
  
  return {
    ...photo,
    imageUrl,
    judgeScore: backendPhoto.judgeScore || 0,
    visitorVotes: backendPhoto.visitorVotes || 0,
  };
};
```

## How It Works Now

### Image Display
1. Backend stores images in `/uploads/` folder
2. Photo document stores relative path: `/uploads/sample1.jpg`
3. Frontend transforms to full URL: `http://localhost:5000/uploads/sample1.jpg`
4. Images display correctly in Gallery, Voting, and all pages

### Voting Flow
1. User clicks "Vote" button
2. Frontend calls `submitVote(photoId, email, name)`
3. Service creates/gets visitor → receives visitorId
4. Service submits vote with photoId + visitorId
5. Vote is recorded in database
6. Vote count updates in UI

### Scores Display
1. Photos are fetched from `/api/photos`
2. For each photo, fetch:
   - Judge scores from `/api/scores?photoId=xxx`
   - Visitor votes from `/api/votes/photo/xxx/count`
3. Calculate totals and attach to photo object
4. Display in UI

## Testing

### Test Images Display
1. Go to Gallery page
2. All photos should display with images
3. Check browser console - no 404 errors for images

### Test Voting
1. Go to Voting page
2. Click "Vote" on any photo
3. Should see success message
4. Vote count should increase
5. Button should change to "Voted" and be disabled

### Test Scores
1. Login as judge (emily@judge.com / password123)
2. Go to Judges Panel
3. Update scores for photos
4. Scores should display correctly

## Backend Endpoints Used

- `GET /api/photos` - Get all photos
- `GET /api/scores?photoId=xxx` - Get scores for a photo
- `GET /api/votes/photo/:photoId/count` - Get vote count
- `POST /votes/visitors` - Create/get visitor
- `POST /votes` - Submit vote

## All Fixed! 🎉

- ✅ Images display in Gallery
- ✅ Images display in Voting page
- ✅ Images display in Judges Panel
- ✅ Voting works correctly
- ✅ Vote counts update
- ✅ Judge scores display
- ✅ No more errors in console
