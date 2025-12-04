# API Testing Guide

## Quick Start Testing

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Register Users

#### Register Photographer
```bash
curl -X POST http://localhost:5000/api/auth/register/photographer \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Photography",
    "email": "alex@photo.com",
    "password": "password123",
    "phone": "+1234567890",
    "bio": "Professional photographer"
  }'
```

#### Register Judge
```bash
curl -X POST http://localhost:5000/api/auth/register/judge \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Expert",
    "email": "maria@judge.com",
    "password": "password123",
    "expertise": "Photography Expert"
  }'
```

### 3. Login
```bash
# Login as Photographer
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex@photo.com",
    "password": "password123"
  }'

# Save the token from response
```

### 4. Get All Categories
```bash
curl http://localhost:5000/api/categories
```

### 5. Submit Photo (Photographer)
```bash
# Replace YOUR_TOKEN with actual JWT token
curl -X POST http://localhost:5000/api/photos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/your/photo.jpg" \
  -F "title=Beautiful Sunset" \
  -F "description=A stunning sunset over mountains" \
  -F "categoryId=CATEGORY_ID_HERE"
```

### 6. Get All Photos
```bash
curl http://localhost:5000/api/photos
```

### 7. Submit Judge Score (Judge)
```bash
# Login as judge first, then:
curl -X POST http://localhost:5000/api/scores \
  -H "Authorization: Bearer JUDGE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "photoId": "PHOTO_ID_HERE",
    "score": 9,
    "comment": "Excellent composition and lighting"
  }'
```

### 8. Add Visitor and Vote
```bash
# Register visitor
curl -X POST http://localhost:5000/api/votes/visitors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Visitor",
    "email": "john@visitor.com"
  }'

# Submit vote
curl -X POST http://localhost:5000/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "visitorId": "VISITOR_ID_HERE",
    "photoId": "PHOTO_ID_HERE"
  }'
```

### 9. Analytics Examples

```bash
# Photographers with multiple categories
curl http://localhost:5000/api/analytics/photographers-multiple-categories

# Highest scored photo
curl http://localhost:5000/api/analytics/highest-scored-photo

# Categories with high submissions
curl "http://localhost:5000/api/analytics/categories-high-submissions?threshold=2"

# Top winners in Wildlife
curl http://localhost:5000/api/analytics/top-winners/Wildlife
```

## Postman Collection

Import these endpoints into Postman:

1. Create a new collection "Photography Contest API"
2. Add environment variables:
   - `baseUrl`: http://localhost:5000
   - `token`: (will be set after login)
3. Import all endpoints from the list above

## Testing Workflow

1. ✅ Seed database: `npm run seed`
2. ✅ Login as admin: `admin@contest.com` / `admin123`
3. ✅ Login as photographer: `john@photographer.com` / `password123`
4. ✅ Submit a photo
5. ✅ Login as judge: `emily@judge.com` / `password123`
6. ✅ Score the photo
7. ✅ Add visitors and votes
8. ✅ Test analytics endpoints
9. ✅ Declare winners (admin only)

## Response Examples

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```
