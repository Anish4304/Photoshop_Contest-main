1. List photographers who submitted entries in multiple categories


db.photos.aggregate([
  { $group: { _id: "$photographerId", categories: { $addToSet: "$categoryId" } } },
  { $project: { categoryCount: { $size: "$categories" } } },
  { $match: { categoryCount: { $gt: 1 } } }
])

2. Find the photo with the highest combined judge and visitor score


db.photos.aggregate([
  { $lookup: { from: "judgescores", localField: "_id", foreignField: "photoId", as: "judgeScores" } },
  { $lookup: { from: "visitorvotes", localField: "_id", foreignField: "photoId", as: "visitorVotes" } },
  { $addFields: { combinedScore: { $add: [{ $sum: "$judgeScores.score" }, { $size: "$visitorVotes" }] } } },
  { $sort: { combinedScore: -1 } },
  { $limit: 1 }
])

3. Show categories with more than 50 photo submissions
db.photos.aggregate([
  { $group: { _id: "$categoryId", submissionCount: { $sum: 1 } } },
  { $match: { submissionCount: { $gt: 50 } } }
])

4. Retrieve judges who scored more than 20 entries
db.judgescores.aggregate([
  { $group: { _id: "$judgeId", scoredCount: { $sum: 1 } } },
  { $match: { scoredCount: { $gt: 20 } } }
])

5. Calculate the average visitor votes per category
db.photos.aggregate([
  { $lookup: { from: "visitorvotes", localField: "_id", foreignField: "photoId", as: "votes" } },
  { $addFields: { voteCount: { $size: "$votes" } } },
  { $group: { _id: "$categoryId", totalVotes: { $sum: "$voteCount" }, photoCount: { $sum: 1 } } },
  { $project: { averageVotes: { $divide: ["$totalVotes", "$photoCount"] } } }
])

6. Identify photos displayed in multiple galleries
db.photos.find({
  galleries: { $exists: true },
  $where: "this.galleries.length > 1"
})

7. Find photographers who won in more than one category
db.winners.aggregate([
  { $lookup: { from: "photos", localField: "photoId", foreignField: "_id", as: "photo" } },
  { $unwind: "$photo" },
  { $group: { _id: "$photo.photographerId", categories: { $addToSet: "$categoryId" } } },
  { $project: { categoryCount: { $size: "$categories" } } },
  { $match: { categoryCount: { $gt: 1 } } }
])

8. Show categories where no winner was announced
db.categories.aggregate([
  { $lookup: { from: "winners", localField: "_id", foreignField: "categoryId", as: "winner" } },
  { $match: { "winner.0": { $exists: false } } }
])

9. Retrieve visitors who voted for more than 10 photos
db.visitorvotes.aggregate([
  { $group: { _id: "$visitorId", voteCount: { $sum: 1 } } },
  { $match: { voteCount: { $gt: 10 } } }
])

10. Find the category with the most submissions overall
db.photos.aggregate([
  { $group: { _id: "$categoryId", submissionCount: { $sum: 1 } } },
  { $sort: { submissionCount: -1 } },
  { $limit: 1 }
])

11. Show top 3 winning photos in “Wildlife” category

(Replace "WILDLIFE_ID" with actual ObjectId)

db.winners.find({ categoryId: ObjectId("WILDLIFE_ID") })
  .sort({ position: 1 })
  .limit(3)

12. Identify photographers who received high scores but no awards
db.photos.aggregate([
  { $lookup: { from: "judgescores", localField: "_id", foreignField: "photoId", as: "scores" } },
  { $addFields: { totalScore: { $sum: "$scores.score" } } },
  { $match: { totalScore: { $gte: 30 } } },
  { $lookup: { from: "winners", localField: "_id", foreignField: "photoId", as: "winner" } },
  { $match: { "winner.0": { $exists: false } } }
])