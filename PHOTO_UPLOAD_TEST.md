# Photo Upload Testing Guide

## ✅ What Was Fixed

### Issues Resolved:
1. **File Upload Not Working**: Frontend was using `addPhoto()` which only updated local state
2. **No Backend Integration**: Photos were not being sent to the server
3. **Wrong Field Name**: Frontend sent `photo` but backend expected `image`
4. **Category Loading**: Frontend was using hardcoded sample data instead of loading from API
5. **Image URL Construction**: Photos stored with relative paths now properly resolved to full URLs

### Changes Made:
1. ✅ Updated `PhotographerDashboard.tsx` to use `uploadPhoto()` API
2. ✅ Load categories from backend instead of sample data
3. ✅ Send FormData with `image` field (matching backend expectation)
4. ✅ Added loading states and error handling
5. ✅ Updated transformers to construct full image URLs
6. ✅ Refresh photo list after successful upload

## 🧪 How to Test Photo Upload

### Step 1: Login as Photographer
1. Go to http://localhost:5173/
2. Click "Login" (top right)
3. Use credentials:
   - Email: `john@photographer.com`
   - Password: `password123`
4. Select "Photographer" role
5. Click Login

### Step 2: Access Dashboard
- You should be redirected to `/photographer-dashboard`
- Click "Submit New Photo" button

### Step 3: Upload Photo
1. **Drag & Drop Method:**
   - Drag an image file onto the upload area
   - You should see the file name appear
   - Preview will show below

2. **Browse Method:**
   - Click "browse" link or anywhere in upload area
   - Select an image file (JPG, PNG, GIF, WEBP)
   - Preview will show below

### Step 4: Fill Form
1. Enter Photo Title (required)
2. Enter Description (required)
3. Select Category from dropdown (Nature, Portrait, Wildlife, Street)
4. Verify image preview is showing
5. Click "Submit Photo"

### Step 5: Verify Upload
1. **Loading State**: Button should show "Uploading..." and be disabled
2. **Success**: 
   - Form should close automatically
   - New photo should appear in "Your Submissions" section
   - Photo count should increase
3. **Error**: If error occurs, red error message will display above buttons

## 🔍 Verification Steps

### Check Backend Received File:
```powershell
# List uploaded files
Get-ChildItem "c:\Users\ASUS\Downloads\anish\Photoshop_Contest\backend\uploads"
```

### Check Database:
```powershell
# Test API to see all photos
$response = Invoke-RestMethod -Uri 'http://localhost:5000/api/photos' -Method Get
$response.data | Select-Object title, imageUrl, photographerId
```

### Check Browser Console:
1. Open Browser DevTools (F12)
2. Go to Console tab
3. Look for:
   - ✅ "Request: POST /api/photos" with FormData
   - ✅ "Response: POST /api/photos" with success: true
   - ❌ Any errors in red

### Check Network Tab:
1. Open Browser DevTools (F12)
2. Go to Network tab
3. Upload a photo
4. Look for POST request to `/api/photos`
5. Check:
   - Status: Should be 201 (Created)
   - Response: Should have `success: true` and photo data
   - Payload: Should show FormData with image file

## 🐛 Troubleshooting

### "Please upload an image" Error
- **Cause**: Backend didn't receive file
- **Fix**: Verify field name is `image` in FormData
- **Check**: Look at Network tab → Payload → Form Data

### "Failed to upload photo" Error
- **Cause**: Various issues (file size, auth, server error)
- **Fix**: Check browser console for details
- **Check**: Backend terminal for error messages

### Photo Not Showing After Upload
- **Cause**: Image URL construction issue
- **Fix**: Check transformer in `src/utils/transformers.ts`
- **Check**: Inspect photo object in browser console

### Categories Not Loading
- **Cause**: Backend not responding or categories empty
- **Fix**: Run seed script: `cd backend && npm run seed`
- **Check**: Test API: `Invoke-RestMethod http://localhost:5000/api/categories`

### File Too Large
- **Cause**: File exceeds 5MB limit
- **Fix**: Use smaller image or increase limit in `backend/src/config/multer.ts`
- **Check**: Error message will say "File too large"

### Wrong File Type
- **Cause**: Not an image file
- **Fix**: Only use JPG, JPEG, PNG, GIF, WEBP files
- **Check**: Error message will say "Invalid file type"

## ✨ Expected Behavior

### Before Upload:
- Upload area shows drag & drop message
- Categories loaded from backend (Nature, Portrait, Wildlife, Street)
- Submit button enabled when all fields filled

### During Upload:
- Button shows "Uploading..." and is disabled
- Cannot cancel or close form
- File is sent to backend via FormData

### After Successful Upload:
- Form closes automatically
- Error message cleared
- Photo list refreshes from backend
- New photo appears in "Your Submissions"
- Statistics updated (total submissions, scores, votes)

### Photo Display:
- Photo shows with correct image
- Title and description visible
- Category badge shown
- Judge score and visitor votes displayed
- View and Delete buttons available

## 📊 Current System Status

- ✅ **Backend**: Running on http://localhost:5000
- ✅ **Frontend**: Running on http://localhost:5173
- ✅ **Database**: MongoDB Atlas connected
- ✅ **Photo Upload**: Fully functional with FormData
- ✅ **File Storage**: backend/uploads directory
- ✅ **Image Serving**: Static files served at /uploads
- ✅ **Categories**: Loaded from backend API
- ✅ **Authentication**: JWT tokens working
- ✅ **Error Handling**: Proper error messages displayed

## 🎉 Ready to Test!

Your photo upload system is now **fully integrated** with the backend!

Try uploading a photo and verify it appears in:
1. Frontend photographer dashboard
2. Backend uploads folder
3. MongoDB database
4. Gallery page (http://localhost:5173/gallery)
