# All 12 Analytics Queries - MongoDB & SQL

## Query 1: List photographers who submitted entries in multiple categories

### MongoDB Aggregation
```javascript
db.photos.aggregate([
  {
    $group: {
      _id: "$photographerId",
      categories: { $addToSet: "$categoryId" },
      categoryCount: { $sum: 1 }
    }
  },
  {
    $project: {
      photographerId: "$_id",
      categoryCount: { $size: "$categories" }
    }
  },
  {
    $match: {
      categoryCount: { $gt: 1 }
    }
  },
  {
    $lookup: {
      from: "photographers",
      localField: "photographerId",
      foreignField: "_id",
      as: "photographer"
    }
  },
  {
    $unwind: "$photographer"
  },
  {
    $project: {
      photographerName: "$photographer.name",
      photographerEmail: "$photographer.email",
      categoryCount: 1
    }
  }
])
```

### SQL Equivalent
```sql
SELECT 
  p.name AS photographerName,
  p.email AS photographerEmail,
  COUNT(DISTINCT ph.categoryId) AS categoryCount
FROM photos ph
JOIN photographers p ON ph.photographerId = p.id
GROUP BY p.id, p.name, p.email
HAVING COUNT(DISTINCT ph.categoryId) > 1;
```

---

## Query 2: Find the photo with the highest combined judge + visitor score

### MongoDB Aggregation
```javascript
db.photos.aggregate([
  {
    $lookup: {
      from: "judgescores",
      localField: "_id",
      foreignField: "photoId",
      as: "judgeScores"
    }
  },
  {
    $lookup: {
      from: "visitorvotes",
      localField: "_id",
      foreignField: "photoId",
      as: "visitorVotes"
    }
  },
  {
    $addFields: {
      totalJudgeScore: { $sum: "$judgeScores.score" },
      totalVisitorVotes: { $size: "$visitorVotes" }
    }
  },
  {
    $addFields: {
      combinedScore: { $add: ["$totalJudgeScore", "$totalVisitorVotes"] }
    }
  },
  {
    $sort: { combinedScore: -1 }
  },
  {
    $limit: 1
  },
  {
    $lookup: {
      from: "photographers",
      localField: "photographerId",
      foreignField: "_id",
      as: "photographer"
    }
  },
  {
    $unwind: "$photographer"
  },
  {
    $project: {
      title: 1,
      imageUrl: 1,
      photographerName: "$photographer.name",
      totalJudgeScore: 1,
      totalVisitorVotes: 1,
      combinedScore: 1
    }
  }
])
```

### SQL Equivalent
```sql
SELECT 
  ph.title,
  ph.imageUrl,
  p.name AS photographerName,
  COALESCE(SUM(js.score), 0) AS totalJudgeScore,
  COUNT(DISTINCT vv.id) AS totalVisitorVotes,
  COALESCE(SUM(js.score), 0) + COUNT(DISTINCT vv.id) AS combinedScore
FROM photos ph
JOIN photographers p ON ph.photographerId = p.id
LEFT JOIN judgescores js ON ph.id = js.photoId
LEFT JOIN visitorvotes vv ON ph.id = vv.photoId
GROUP BY ph.id, ph.title, ph.imageUrl, p.name
ORDER BY combinedScore DESC
LIMIT 1;
```

---

## Query 3: Show categories with more than 50 submissions

### MongoDB Aggregation
```javascript
db.photos.aggregate([
  {
    $group: {
      _id: "$categoryId",
      submissionCount: { $sum: 1 }
    }
  },
  {
    $match: {
      submissionCount: { $gt: 50 }
    }
  },
  {
    $lookup: {
      from: "categories",
      localField: "_id",
      foreignField: "_id",
      as: "category"
    }
  },
  {
    $unwind: "$category"
  },
  {
    $project: {
      categoryName: "$category.name",
      submissionCount: 1
    }
  },
  {
    $sort: { submissionCount: -1 }
  }
])
```

### SQL Equivalent
```sql
SELECT 
  c.name AS categoryName,
  COUNT(p.id) AS submissionCount
FROM photos p
JOIN categories c ON p.categoryId = c.id
GROUP BY c.id, c.name
HAVING COUNT(p.id) > 50
ORDER BY submissionCount DESC;
```

---

## Query 4: Retrieve judges who scored more than 20 entries

### MongoDB Aggregation
```javascript
db.judgescores.aggregate([
  {
    $group: {
      _id: "$judgeId",
      scoredCount: { $sum: 1 }
    }
  },
  {
    $match: {
      scoredCount: { $gt: 20 }
    }
  },
  {
    $lookup: {
      from: "judges",
      localField: "_id",
      foreignField: "_id",
      as: "judge"
    }
  },
  {
    $unwind: "$judge"
  },
  {
    $project: {
      judgeName: "$judge.name",
      judgeEmail: "$judge.email",
      expertise: "$judge.expertise",
      scoredCount: 1
    }
  },
  {
    $sort: { scoredCount: -1 }
  }
])
```

### SQL Equivalent
```sql
SELECT 
  j.name AS judgeName,
  j.email AS judgeEmail,
  j.expertise,
  COUNT(js.id) AS scoredCount
FROM judgescores js
JOIN judges j ON js.judgeId = j.id
GROUP BY j.id, j.name, j.email, j.expertise
HAVING COUNT(js.id) > 20
ORDER BY scoredCount DESC;
```

---

## Query 5: Calculate average visitor votes per category

### MongoDB Aggregation
```javascript
db.photos.aggregate([
  {
    $lookup: {
      from: "visitorvotes",
      localField: "_id",
      foreignField: "photoId",
      as: "votes"
    }
  },
  {
    $addFields: {
      voteCount: { $size: "$votes" }
    }
  },
  {
    $group: {
      _id: "$categoryId",
      totalVotes: { $sum: "$voteCount" },
      photoCount: { $sum: 1 }
    }
  },
  {
    $addFields: {
      averageVotes: { $divide: ["$totalVotes", "$photoCount"] }
    }
  },
  {
    $lookup: {
      from: "categories",
      localField: "_id",
      foreignField: "_id",
      as: "category"
    }
  },
  {
    $unwind: "$category"
  },
  {
    $project: {
      categoryName: "$category.name",
      totalVotes: 1,
      photoCount: 1,
      averageVotes: { $round: ["$averageVotes", 2] }
    }
  },
  {
    $sort: { averageVotes: -1 }
  }
])
```

### SQL Equivalent
```sql
SELECT 
  c.name AS categoryName,
  COUNT(vv.id) AS totalVotes,
  COUNT(DISTINCT p.id) AS photoCount,
  ROUND(COUNT(vv.id) * 1.0 / COUNT(DISTINCT p.id), 2) AS averageVotes
FROM photos p
JOIN categories c ON p.categoryId = c.id
LEFT JOIN visitorvotes vv ON p.id = vv.photoId
GROUP BY c.id, c.name
ORDER BY averageVotes DESC;
```

---

## Query 6: Identify photos displayed in multiple galleries

### MongoDB Aggregation
```javascript
db.photos.aggregate([
  {
    $match: {
      galleries: { $exists: true }
    }
  },
  {
    $addFields: {
      galleryCount: { $size: "$galleries" }
    }
  },
  {
    $match: {
      galleryCount: { $gt: 1 }
    }
  },
  {
    $lookup: {
      from: "photographers",
      localField: "photographerId",
      foreignField: "_id",
      as: "photographer"
    }
  },
  {
    $unwind: "$photographer"
  },
  {
    $lookup: {
      from: "galleries",
      localField: "galleries",
      foreignField: "_id",
      as: "galleryDetails"
    }
  },
  {
    $project: {
      title: 1,
      photographerName: "$photographer.name",
      galleryCount: 1,
      galleries: "$galleryDetails.name"
    }
  },
  {
    $sort: { galleryCount: -1 }
  }
])
```

### SQL Equivalent
```sql
SELECT 
  p.title,
  ph.name AS photographerName,
  COUNT(pg.galleryId) AS galleryCount,
  GROUP_CONCAT(g.name) AS galleries
FROM photos p
JOIN photographers ph ON p.photographerId = ph.id
JOIN photo_galleries pg ON p.id = pg.photoId
JOIN galleries g ON pg.galleryId = g.id
GROUP BY p.id, p.title, ph.name
HAVING COUNT(pg.galleryId) > 1
ORDER BY galleryCount DESC;
```

---

## Query 7: Find photographers who won in more than one category

### MongoDB Aggregation
```javascript
db.winners.aggregate([
  {
    $lookup: {
      from: "photos",
      localField: "photoId",
      foreignField: "_id",
      as: "photo"
    }
  },
  {
    $unwind: "$photo"
  },
  {
    $group: {
      _id: "$photo.photographerId",
      categories: { $addToSet: "$categoryId" },
      wins: { $sum: 1 }
    }
  },
  {
    $project: {
      photographerId: "$_id",
      categoryCount: { $size: "$categories" },
      wins: 1
    }
  },
  {
    $match: {
      categoryCount: { $gt: 1 }
    }
  },
  {
    $lookup: {
      from: "photographers",
      localField: "photographerId",
      foreignField: "_id",
      as: "photographer"
    }
  },
  {
    $unwind: "$photographer"
  },
  {
    $project: {
      photographerName: "$photographer.name",
      photographerEmail: "$photographer.email",
      categoryCount: 1,
      totalWins: "$wins"
    }
  },
  {
    $sort: { categoryCount: -1 }
  }
])
```

### SQL Equivalent
```sql
SELECT 
  p.name AS photographerName,
  p.email AS photographerEmail,
  COUNT(DISTINCT w.categoryId) AS categoryCount,
  COUNT(w.id) AS totalWins
FROM winners w
JOIN photos ph ON w.photoId = ph.id
JOIN photographers p ON ph.photographerId = p.id
GROUP BY p.id, p.name, p.email
HAVING COUNT(DISTINCT w.categoryId) > 1
ORDER BY categoryCount DESC;
```

---

## Query 8: Show categories where no winner was announced

### MongoDB Aggregation
```javascript
db.categories.aggregate([
  {
    $lookup: {
      from: "winners",
      localField: "_id",
      foreignField: "categoryId",
      as: "winners"
    }
  },
  {
    $match: {
      winners: { $size: 0 }
    }
  },
  {
    $lookup: {
      from: "photos",
      localField: "_id",
      foreignField: "categoryId",
      as: "photos"
    }
  },
  {
    $project: {
      name: 1,
      description: 1,
      submissionCount: { $size: "$photos" }
    }
  }
])
```

### SQL Equivalent
```sql
SELECT 
  c.name,
  c.description,
  COUNT(p.id) AS submissionCount
FROM categories c
LEFT JOIN winners w ON c.id = w.categoryId
LEFT JOIN photos p ON c.id = p.categoryId
WHERE w.id IS NULL
GROUP BY c.id, c.name, c.description;
```

---

## Query 9: Retrieve visitors who voted for more than 10 photos

### MongoDB Aggregation
```javascript
db.visitorvotes.aggregate([
  {
    $group: {
      _id: "$visitorId",
      voteCount: { $sum: 1 }
    }
  },
  {
    $match: {
      voteCount: { $gt: 10 }
    }
  },
  {
    $lookup: {
      from: "visitors",
      localField: "_id",
      foreignField: "_id",
      as: "visitor"
    }
  },
  {
    $unwind: "$visitor"
  },
  {
    $project: {
      visitorName: "$visitor.name",
      visitorEmail: "$visitor.email",
      voteCount: 1
    }
  },
  {
    $sort: { voteCount: -1 }
  }
])
```

### SQL Equivalent
```sql
SELECT 
  v.name AS visitorName,
  v.email AS visitorEmail,
  COUNT(vv.id) AS voteCount
FROM visitorvotes vv
JOIN visitors v ON vv.visitorId = v.id
GROUP BY v.id, v.name, v.email
HAVING COUNT(vv.id) > 10
ORDER BY voteCount DESC;
```

---

## Query 10: Find the category with the most submissions overall

### MongoDB Aggregation
```javascript
db.photos.aggregate([
  {
    $group: {
      _id: "$categoryId",
      submissionCount: { $sum: 1 }
    }
  },
  {
    $sort: { submissionCount: -1 }
  },
  {
    $limit: 1
  },
  {
    $lookup: {
      from: "categories",
      localField: "_id",
      foreignField: "_id",
      as: "category"
    }
  },
  {
    $unwind: "$category"
  },
  {
    $project: {
      categoryName: "$category.name",
      description: "$category.description",
      submissionCount: 1
    }
  }
])
```

### SQL Equivalent
```sql
SELECT 
  c.name AS categoryName,
  c.description,
  COUNT(p.id) AS submissionCount
FROM photos p
JOIN categories c ON p.categoryId = c.id
GROUP BY c.id, c.name, c.description
ORDER BY submissionCount DESC
LIMIT 1;
```

---

## Query 11: Show top 3 winning photos in specific category

### MongoDB Aggregation
```javascript
db.winners.aggregate([
  {
    $match: {
      categoryId: ObjectId("CATEGORY_ID_HERE")
    }
  },
  {
    $sort: { position: 1 }
  },
  {
    $limit: 3
  },
  {
    $lookup: {
      from: "photos",
      localField: "photoId",
      foreignField: "_id",
      as: "photo"
    }
  },
  {
    $unwind: "$photo"
  },
  {
    $lookup: {
      from: "photographers",
      localField: "photo.photographerId",
      foreignField: "_id",
      as: "photographer"
    }
  },
  {
    $unwind: "$photographer"
  },
  {
    $project: {
      position: 1,
      totalScore: 1,
      photoTitle: "$photo.title",
      photoImageUrl: "$photo.imageUrl",
      photographerName: "$photographer.name"
    }
  }
])
```

### SQL Equivalent
```sql
SELECT 
  w.position,
  w.totalScore,
  p.title AS photoTitle,
  p.imageUrl AS photoImageUrl,
  ph.name AS photographerName
FROM winners w
JOIN photos p ON w.photoId = p.id
JOIN photographers ph ON p.photographerId = ph.id
WHERE w.categoryId = 'CATEGORY_ID_HERE'
ORDER BY w.position ASC
LIMIT 3;
```

---

## Query 12: Identify photographers who received high judge scores but no awards

### MongoDB Aggregation
```javascript
db.photos.aggregate([
  {
    $lookup: {
      from: "judgescores",
      localField: "_id",
      foreignField: "photoId",
      as: "judgeScores"
    }
  },
  {
    $addFields: {
      totalJudgeScore: { $sum: "$judgeScores.score" }
    }
  },
  {
    $match: {
      totalJudgeScore: { $gte: 30 }
    }
  },
  {
    $lookup: {
      from: "winners",
      localField: "_id",
      foreignField: "photoId",
      as: "winner"
    }
  },
  {
    $match: {
      winner: { $size: 0 }
    }
  },
  {
    $lookup: {
      from: "photographers",
      localField: "photographerId",
      foreignField: "_id",
      as: "photographer"
    }
  },
  {
    $unwind: "$photographer"
  },
  {
    $group: {
      _id: "$photographerId",
      photographerName: { $first: "$photographer.name" },
      photographerEmail: { $first: "$photographer.email" },
      photoTitles: { $push: "$title" },
      highestScore: { $max: "$totalJudgeScore" },
      averageScore: { $avg: "$totalJudgeScore" }
    }
  },
  {
    $project: {
      photographerName: 1,
      photographerEmail: 1,
      highestScore: 1,
      averageScore: { $round: ["$averageScore", 2] },
      photos: "$photoTitles"
    }
  },
  {
    $sort: { highestScore: -1 }
  }
])
```

### SQL Equivalent
```sql
SELECT 
  p.name AS photographerName,
  p.email AS photographerEmail,
  MAX(total_scores.totalJudgeScore) AS highestScore,
  ROUND(AVG(total_scores.totalJudgeScore), 2) AS averageScore,
  GROUP_CONCAT(ph.title) AS photos
FROM (
  SELECT 
    ph.id,
    ph.title,
    ph.photographerId,
    SUM(js.score) AS totalJudgeScore
  FROM photos ph
  JOIN judgescores js ON ph.id = js.photoId
  GROUP BY ph.id, ph.title, ph.photographerId
  HAVING SUM(js.score) >= 30
) AS total_scores
JOIN photographers p ON total_scores.photographerId = p.id
LEFT JOIN winners w ON total_scores.id = w.photoId
WHERE w.id IS NULL
GROUP BY p.id, p.name, p.email
ORDER BY highestScore DESC;
```

---

## API Endpoints

All queries are accessible via REST API:

1. `GET /api/analytics/photographers-multiple-categories`
2. `GET /api/analytics/highest-scored-photo`
3. `GET /api/analytics/categories-high-submissions?threshold=50`
4. `GET /api/analytics/judges-high-activity?threshold=20`
5. `GET /api/analytics/average-votes-per-category`
6. `GET /api/analytics/photos-multiple-galleries`
7. `GET /api/analytics/photographers-multiple-wins`
8. `GET /api/analytics/categories-no-winners`
9. `GET /api/analytics/visitors-high-engagement?threshold=10`
10. `GET /api/analytics/category-most-submissions`
11. `GET /api/analytics/top-winners/:categoryName`
12. `GET /api/analytics/photographers-high-scores-no-awards?minScore=30`

## Testing Queries

```bash
# Example: Test Query #3
curl http://localhost:5000/api/analytics/categories-high-submissions

# With custom threshold
curl http://localhost:5000/api/analytics/categories-high-submissions?threshold=10
```
