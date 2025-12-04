import { Request, Response } from 'express';
import Photo from '../models/Photo';
import JudgeScore from '../models/JudgeScore';
import VisitorVote from '../models/VisitorVote';
import Winner from '../models/Winner';
import Category from '../models/Category';
import mongoose from 'mongoose';

// @desc    1. List photographers who submitted entries in multiple categories
// @route   GET /api/analytics/photographers-multiple-categories
// @access  Public
export const photographersMultipleCategories = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await Photo.aggregate([
      {
        $group: {
          _id: '$photographerId',
          categories: { $addToSet: '$categoryId' },
          categoryCount: { $sum: 1 },
        },
      },
      {
        $match: {
          categories: { $exists: true },
        },
      },
      {
        $project: {
          photographerId: '$_id',
          categoryCount: { $size: '$categories' },
          categories: 1,
        },
      },
      {
        $match: {
          categoryCount: { $gt: 1 },
        },
      },
      {
        $lookup: {
          from: 'photographers',
          localField: 'photographerId',
          foreignField: '_id',
          as: 'photographer',
        },
      },
      {
        $unwind: '$photographer',
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $project: {
          _id: 0,
          photographerId: '$photographerId',
          photographerName: '$photographer.name',
          photographerEmail: '$photographer.email',
          categoryCount: 1,
          categories: '$categoryDetails.name',
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    2. Find the photo with the highest combined judge + visitor score
// @route   GET /api/analytics/highest-scored-photo
// @access  Public
export const highestScoredPhoto = async (req: Request, res: Response) => {
  try {
    const result = await Photo.aggregate([
      {
        $lookup: {
          from: 'judgescores',
          localField: '_id',
          foreignField: 'photoId',
          as: 'judgeScores',
        },
      },
      {
        $lookup: {
          from: 'visitorvotes',
          localField: '_id',
          foreignField: 'photoId',
          as: 'visitorVotes',
        },
      },
      {
        $addFields: {
          totalJudgeScore: { $sum: '$judgeScores.score' },
          totalVisitorVotes: { $size: '$visitorVotes' },
        },
      },
      {
        $addFields: {
          combinedScore: { $add: ['$totalJudgeScore', '$totalVisitorVotes'] },
        },
      },
      {
        $sort: { combinedScore: -1 },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: 'photographers',
          localField: 'photographerId',
          foreignField: '_id',
          as: 'photographer',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$photographer',
      },
      {
        $unwind: '$category',
      },
      {
        $project: {
          _id: 1,
          title: 1,
          imageUrl: 1,
          photographerName: '$photographer.name',
          categoryName: '$category.name',
          totalJudgeScore: 1,
          totalVisitorVotes: 1,
          combinedScore: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result[0] || null,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    3. Show categories with more than 50 submissions
// @route   GET /api/analytics/categories-high-submissions
// @access  Public
export const categoriesWithHighSubmissions = async (
  req: Request,
  res: Response
) => {
  try {
    const threshold = parseInt(req.query.threshold as string) || 50;

    const result = await Photo.aggregate([
      {
        $group: {
          _id: '$categoryId',
          submissionCount: { $sum: 1 },
        },
      },
      {
        $match: {
          submissionCount: { $gt: threshold },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          categoryName: '$category.name',
          submissionCount: 1,
        },
      },
      {
        $sort: { submissionCount: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    4. Retrieve judges who scored more than 20 entries
// @route   GET /api/analytics/judges-high-activity
// @access  Public
export const judgesHighActivity = async (req: Request, res: Response) => {
  try {
    const threshold = parseInt(req.query.threshold as string) || 20;

    const result = await JudgeScore.aggregate([
      {
        $group: {
          _id: '$judgeId',
          scoredCount: { $sum: 1 },
        },
      },
      {
        $match: {
          scoredCount: { $gt: threshold },
        },
      },
      {
        $lookup: {
          from: 'judges',
          localField: '_id',
          foreignField: '_id',
          as: 'judge',
        },
      },
      {
        $unwind: '$judge',
      },
      {
        $project: {
          _id: 0,
          judgeId: '$_id',
          judgeName: '$judge.name',
          judgeEmail: '$judge.email',
          expertise: '$judge.expertise',
          scoredCount: 1,
        },
      },
      {
        $sort: { scoredCount: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    5. Calculate average visitor votes per category
// @route   GET /api/analytics/average-votes-per-category
// @access  Public
export const averageVotesPerCategory = async (req: Request, res: Response) => {
  try {
    const result = await Photo.aggregate([
      {
        $lookup: {
          from: 'visitorvotes',
          localField: '_id',
          foreignField: 'photoId',
          as: 'votes',
        },
      },
      {
        $addFields: {
          voteCount: { $size: '$votes' },
        },
      },
      {
        $group: {
          _id: '$categoryId',
          totalVotes: { $sum: '$voteCount' },
          photoCount: { $sum: 1 },
        },
      },
      {
        $addFields: {
          averageVotes: { $divide: ['$totalVotes', '$photoCount'] },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          categoryName: '$category.name',
          totalVotes: 1,
          photoCount: 1,
          averageVotes: { $round: ['$averageVotes', 2] },
        },
      },
      {
        $sort: { averageVotes: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    6. Identify photos displayed in multiple galleries
// @route   GET /api/analytics/photos-multiple-galleries
// @access  Public
export const photosInMultipleGalleries = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await Photo.aggregate([
      {
        $match: {
          galleries: { $exists: true },
        },
      },
      {
        $addFields: {
          galleryCount: { $size: '$galleries' },
        },
      },
      {
        $match: {
          galleryCount: { $gt: 1 },
        },
      },
      {
        $lookup: {
          from: 'photographers',
          localField: 'photographerId',
          foreignField: '_id',
          as: 'photographer',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $lookup: {
          from: 'galleries',
          localField: 'galleries',
          foreignField: '_id',
          as: 'galleryDetails',
        },
      },
      {
        $unwind: '$photographer',
      },
      {
        $unwind: '$category',
      },
      {
        $project: {
          _id: 1,
          title: 1,
          imageUrl: 1,
          photographerName: '$photographer.name',
          categoryName: '$category.name',
          galleryCount: 1,
          galleries: '$galleryDetails.name',
        },
      },
      {
        $sort: { galleryCount: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    7. Find photographers who won in more than one category
// @route   GET /api/analytics/photographers-multiple-wins
// @access  Public
export const photographersMultipleWins = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await Winner.aggregate([
      {
        $lookup: {
          from: 'photos',
          localField: 'photoId',
          foreignField: '_id',
          as: 'photo',
        },
      },
      {
        $unwind: '$photo',
      },
      {
        $group: {
          _id: '$photo.photographerId',
          categories: { $addToSet: '$categoryId' },
          wins: { $sum: 1 },
        },
      },
      {
        $project: {
          photographerId: '$_id',
          categoryCount: { $size: '$categories' },
          wins: 1,
        },
      },
      {
        $match: {
          categoryCount: { $gt: 1 },
        },
      },
      {
        $lookup: {
          from: 'photographers',
          localField: 'photographerId',
          foreignField: '_id',
          as: 'photographer',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $unwind: '$photographer',
      },
      {
        $project: {
          _id: 0,
          photographerId: '$photographerId',
          photographerName: '$photographer.name',
          photographerEmail: '$photographer.email',
          categoryCount: 1,
          totalWins: '$wins',
          categories: '$categoryDetails.name',
        },
      },
      {
        $sort: { categoryCount: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    8. Show categories where no winner was announced
// @route   GET /api/analytics/categories-no-winners
// @access  Public
export const categoriesWithNoWinners = async (req: Request, res: Response) => {
  try {
    const result = await Category.aggregate([
      {
        $lookup: {
          from: 'winners',
          localField: '_id',
          foreignField: 'categoryId',
          as: 'winners',
        },
      },
      {
        $match: {
          winners: { $size: 0 },
        },
      },
      {
        $lookup: {
          from: 'photos',
          localField: '_id',
          foreignField: 'categoryId',
          as: 'photos',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          submissionCount: { $size: '$photos' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    9. Retrieve visitors who voted for more than 10 photos
// @route   GET /api/analytics/visitors-high-engagement
// @access  Public
export const visitorsHighEngagement = async (req: Request, res: Response) => {
  try {
    const threshold = parseInt(req.query.threshold as string) || 10;

    const result = await VisitorVote.aggregate([
      {
        $group: {
          _id: '$visitorId',
          voteCount: { $sum: 1 },
        },
      },
      {
        $match: {
          voteCount: { $gt: threshold },
        },
      },
      {
        $lookup: {
          from: 'visitors',
          localField: '_id',
          foreignField: '_id',
          as: 'visitor',
        },
      },
      {
        $unwind: '$visitor',
      },
      {
        $project: {
          _id: 0,
          visitorId: '$_id',
          visitorName: '$visitor.name',
          visitorEmail: '$visitor.email',
          voteCount: 1,
        },
      },
      {
        $sort: { voteCount: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    10. Find the category with the most submissions overall
// @route   GET /api/analytics/category-most-submissions
// @access  Public
export const categoryMostSubmissions = async (req: Request, res: Response) => {
  try {
    const result = await Photo.aggregate([
      {
        $group: {
          _id: '$categoryId',
          submissionCount: { $sum: 1 },
        },
      },
      {
        $sort: { submissionCount: -1 },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          categoryName: '$category.name',
          description: '$category.description',
          submissionCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result[0] || null,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    11. Show top 3 winning photos in specific category
// @route   GET /api/analytics/top-winners/:categoryName
// @access  Public
export const topWinnersByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName } = req.params;

    // First find the category
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const result = await Winner.aggregate([
      {
        $match: {
          categoryId: new mongoose.Types.ObjectId(category._id),
        },
      },
      {
        $sort: { position: 1 },
      },
      {
        $limit: 3,
      },
      {
        $lookup: {
          from: 'photos',
          localField: 'photoId',
          foreignField: '_id',
          as: 'photo',
        },
      },
      {
        $unwind: '$photo',
      },
      {
        $lookup: {
          from: 'photographers',
          localField: 'photo.photographerId',
          foreignField: '_id',
          as: 'photographer',
        },
      },
      {
        $unwind: '$photographer',
      },
      {
        $project: {
          _id: 1,
          position: 1,
          totalScore: 1,
          announcement: 1,
          photoTitle: '$photo.title',
          photoImageUrl: '$photo.imageUrl',
          photographerName: '$photographer.name',
          photographerEmail: '$photographer.email',
        },
      },
    ]);

    res.status(200).json({
      success: true,
      category: categoryName,
      count: result.length,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    12. Identify photographers who received high judge scores but no awards
// @route   GET /api/analytics/photographers-high-scores-no-awards
// @access  Public
export const photographersHighScoresNoAwards = async (
  req: Request,
  res: Response
) => {
  try {
    const minScore = parseInt(req.query.minScore as string) || 30;

    const result = await Photo.aggregate([
      {
        $lookup: {
          from: 'judgescores',
          localField: '_id',
          foreignField: 'photoId',
          as: 'judgeScores',
        },
      },
      {
        $addFields: {
          totalJudgeScore: { $sum: '$judgeScores.score' },
        },
      },
      {
        $match: {
          totalJudgeScore: { $gte: minScore },
        },
      },
      {
        $lookup: {
          from: 'winners',
          localField: '_id',
          foreignField: 'photoId',
          as: 'winner',
        },
      },
      {
        $match: {
          winner: { $size: 0 },
        },
      },
      {
        $lookup: {
          from: 'photographers',
          localField: 'photographerId',
          foreignField: '_id',
          as: 'photographer',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$photographer',
      },
      {
        $unwind: '$category',
      },
      {
        $group: {
          _id: '$photographerId',
          photographerName: { $first: '$photographer.name' },
          photographerEmail: { $first: '$photographer.email' },
          photoTitles: { $push: '$title' },
          highestScore: { $max: '$totalJudgeScore' },
          averageScore: { $avg: '$totalJudgeScore' },
        },
      },
      {
        $project: {
          _id: 0,
          photographerId: '$_id',
          photographerName: 1,
          photographerEmail: 1,
          highestScore: 1,
          averageScore: { $round: ['$averageScore', 2] },
          photos: '$photoTitles',
        },
      },
      {
        $sort: { highestScore: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
